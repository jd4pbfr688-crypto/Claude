#!/usr/bin/env python3
"""Base de connaissances locale pour le correcteur de partiels.

Indexe les sources de cours (PDF, .md, .txt) et les fiches distillées dans
une base SQLite FTS5 (recherche plein texte, classement BM25), sans aucun
service externe.

Usage :
  python3 correcteur/scripts/kb.py ingest            # (ré)indexe ce qui a changé
  python3 correcteur/scripts/kb.py search "insuffisance cardiaque BNP" [-n 8] [--matiere cardio] [--fiches|--sources]
  python3 correcteur/scripts/kb.py page sources/cardio/poly.pdf 42   # texte complet d'une page
  python3 correcteur/scripts/kb.py vides             # pages PDF sans texte (scans à transcrire)
  python3 correcteur/scripts/kb.py todo              # sources pas encore distillées en fiches
  python3 correcteur/scripts/kb.py stats
"""
from __future__ import annotations

import argparse
import hashlib
import os
import re
import sqlite3
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # correcteur/
DEFAULT_DB = ROOT / "index" / "kb.sqlite"
SOURCE_DIRS = ("sources", "fiches")
EXTS = {".pdf", ".md", ".txt"}
CHUNK_CHARS = 1500
CHUNK_OVERLAP = 200
MIN_PAGE_CHARS = 40  # en dessous : page considérée vide (scan, image)

STOPWORDS = set(
    """a au aux avec ce ces dans de des du elle en et eux il ils je la le les leur lui ma mais me
    meme mes moi mon ne nos notre nous on ou par pas pour qu que qui sa se ses son sur ta te tes toi
    ton tu un une vos votre vous c d j l m n s t y est sont ete etre avoir quel quelle quels quelles
    plus moins tres sans sous chez lors entre comme donc car si non oui cette cet tout tous toute
    toutes peut doit faut quoi dont ainsi aussi""".split()
)

SCHEMA = """
CREATE TABLE IF NOT EXISTS docs(
  id INTEGER PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,      -- relatif à correcteur/
  kind TEXT NOT NULL,             -- source | fiche
  matiere TEXT NOT NULL,          -- 1er sous-dossier (ex. cardio)
  sha256 TEXT NOT NULL,
  pages INTEGER NOT NULL,
  empty_pages TEXT NOT NULL DEFAULT ''  -- liste "3,4,17"
);
CREATE VIRTUAL TABLE IF NOT EXISTS chunks USING fts5(
  text,
  path UNINDEXED, kind UNINDEXED, matiere UNINDEXED, page UNINDEXED, doc_id UNINDEXED,
  tokenize = "unicode61 remove_diacritics 2"
);
"""


def connect(db: Path) -> sqlite3.Connection:
    db.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(db)
    con.executescript(SCHEMA)
    return con


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def pdf_pages(p: Path) -> list[str]:
    try:
        out = subprocess.run(
            ["pdftotext", "-enc", "UTF-8", str(p), "-"],
            check=True, capture_output=True,
        ).stdout.decode("utf-8", "replace")
    except FileNotFoundError:
        from pypdf import PdfReader  # repli si poppler absent

        return [(pg.extract_text() or "") for pg in PdfReader(str(p)).pages]
    pages = out.split("\f")
    if pages and not pages[-1].strip():
        pages.pop()
    return pages


def text_pages(p: Path) -> list[str]:
    """Un .md/.txt est découpé en « pages » sur les titres de niveau 1-2."""
    txt = p.read_text(encoding="utf-8", errors="replace")
    parts = re.split(r"(?m)^(?=#{1,2} )", txt)
    return [x for x in parts if x.strip()] or [txt]


def clean(s: str) -> str:
    s = s.replace("­", "")                 # césures invisibles
    s = re.sub(r"(\w)-\n(\w)", r"\1\2", s)      # mots coupés en fin de ligne
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def chunk(s: str) -> list[str]:
    if len(s) <= CHUNK_CHARS:
        return [s]
    out, i = [], 0
    while i < len(s):
        j = min(len(s), i + CHUNK_CHARS)
        if j < len(s):  # couper sur une fin de paragraphe/phrase si possible
            cut = max(s.rfind("\n\n", i, j), s.rfind(". ", i, j))
            if cut > i + CHUNK_CHARS // 2:
                j = cut + 1
        out.append(s[i:j].strip())
        if j >= len(s):
            break
        i = max(j - CHUNK_OVERLAP, i + 1)
    return out


def iter_files():
    for d in SOURCE_DIRS:
        base = ROOT / d
        if not base.exists():
            continue
        for p in sorted(base.rglob("*")):
            if p.is_file() and p.suffix.lower() in EXTS and not p.name.startswith((".", "_")):
                if p.name.lower() == "readme.md":
                    continue
                yield d, p


def matiere_of(kind_dir: str, p: Path) -> str:
    rel = p.relative_to(ROOT / kind_dir)
    return rel.parts[0] if len(rel.parts) > 1 else "general"


def cmd_ingest(con: sqlite3.Connection, args) -> None:
    seen, added, skipped = set(), 0, 0
    for kind_dir, p in iter_files():
        rel = str(p.relative_to(ROOT))
        seen.add(rel)
        digest = sha256(p)
        row = con.execute("SELECT id, sha256 FROM docs WHERE path=?", (rel,)).fetchone()
        if row and row[1] == digest and not args.force:
            skipped += 1
            continue
        if row:
            con.execute("DELETE FROM chunks WHERE doc_id=?", (row[0],))
            con.execute("DELETE FROM docs WHERE id=?", (row[0],))
        kind = "fiche" if kind_dir == "fiches" else "source"
        pages = pdf_pages(p) if p.suffix.lower() == ".pdf" else text_pages(p)
        empty = []
        cur = con.execute(
            "INSERT INTO docs(path, kind, matiere, sha256, pages) VALUES(?,?,?,?,?)",
            (rel, kind, matiere_of(kind_dir, p), digest, len(pages)),
        )
        doc_id = cur.lastrowid
        for n, raw in enumerate(pages, start=1):
            txt = clean(raw)
            if len(txt) < MIN_PAGE_CHARS:
                if p.suffix.lower() == ".pdf":
                    empty.append(str(n))
                continue
            for c in chunk(txt):
                con.execute(
                    "INSERT INTO chunks(text, path, kind, matiere, page, doc_id) VALUES(?,?,?,?,?,?)",
                    (c, rel, kind, matiere_of(kind_dir, p), n, doc_id),
                )
        con.execute("UPDATE docs SET empty_pages=? WHERE id=?", (",".join(empty), doc_id))
        added += 1
        warn = f"  ⚠ {len(empty)} page(s) sans texte" if empty else ""
        print(f"indexé  {rel}  ({len(pages)} p.){warn}")
    for (doc_id, rel) in con.execute("SELECT id, path FROM docs").fetchall():
        if rel not in seen:
            con.execute("DELETE FROM chunks WHERE doc_id=?", (doc_id,))
            con.execute("DELETE FROM docs WHERE id=?", (doc_id,))
            print(f"retiré  {rel}")
    con.commit()
    print(f"\n{added} document(s) indexé(s), {skipped} inchangé(s).")


def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def stem(tok: str) -> str:
    """Racinisation très légère du français, utilisée en recherche par préfixe."""
    for suf in ("ements", "ement", "ations", "ation", "iques", "ique", "euses", "euse", "eux",
                "aux", "ees", "es", "ee", "s", "x", "e"):
        if tok.endswith(suf) and len(tok) - len(suf) >= 4:
            return tok[: -len(suf)]
    return tok


def build_query(q: str) -> str:
    toks = re.findall(r"[a-z0-9]+", strip_accents(q.lower()))
    terms = []
    for t in toks:
        if t in STOPWORDS or len(t) < 2:
            continue
        # sigles et nombres (BNP, HTA, 140) : correspondance exacte
        terms.append(f'"{t}"' if len(t) <= 4 or t.isdigit() else f'"{stem(t)}"*')
    return " OR ".join(dict.fromkeys(terms))


def cmd_search(con: sqlite3.Connection, args) -> None:
    q = args.query if args.raw else build_query(args.query)
    if not q:
        sys.exit("Requête vide après filtrage.")
    where, params = ["chunks MATCH ?"], [q]
    if args.matiere:
        where.append("matiere = ?")
        params.append(args.matiere)
    if args.kind:
        where.append("kind = ?")
        params.append(args.kind)
    # Les fiches distillées sont légèrement favorisées (bm25 négatif : plus petit = meilleur).
    sql = f"""
      SELECT path, page, kind,
             bm25(chunks) * CASE kind WHEN 'fiche' THEN 1.3 ELSE 1.0 END AS score,
             snippet(chunks, 0, '[', ']', ' … ', 48)
      FROM chunks WHERE {' AND '.join(where)}
      ORDER BY score LIMIT ?"""
    params.append(args.n)
    rows = con.execute(sql, params).fetchall()
    if not rows:
        print(f"Aucun résultat pour : {q}")
        return
    print(f"requête FTS : {q}\n")
    for i, (path, page, kind, score, snip) in enumerate(rows, 1):
        print(f"{i}. {path} — p.{page} ({kind}, score {-score:.2f})")
        print("   " + snip.replace("\n", " ") + "\n")


def cmd_page(con: sqlite3.Connection, args) -> None:
    path = args.path.removeprefix("correcteur/")
    p = ROOT / path
    if not p.exists():
        sys.exit(f"Fichier introuvable : {p}")
    pages = pdf_pages(p) if p.suffix.lower() == ".pdf" else text_pages(p)
    for n in range(args.page - args.context, args.page + args.context + 1):
        if 1 <= n <= len(pages):
            print(f"===== {path} — page {n}/{len(pages)} =====")
            print(clean(pages[n - 1]) or "(page sans texte : scan ? → la lire visuellement)")
            print()


def cmd_vides(con: sqlite3.Connection, args) -> None:
    rows = con.execute("SELECT path, pages, empty_pages FROM docs WHERE empty_pages != ''").fetchall()
    if not rows:
        print("Aucune page sans texte.")
    for path, pages, empty in rows:
        print(f"{path} ({pages} p.) — pages sans texte : {empty}")


def cmd_todo(con: sqlite3.Connection, args) -> None:
    """Sources sans fiche qui les cite (champ « source: » dans l'en-tête de la fiche)."""
    cited = set()
    for p in (ROOT / "fiches").rglob("*.md"):
        head = p.read_text(encoding="utf-8", errors="replace")[:2000]
        cited.update(m.strip().removeprefix("correcteur/") for m in re.findall(r"(?m)^source:\s*(.+)$", head))
    todo = [r[0] for r in con.execute("SELECT path FROM docs WHERE kind='source' ORDER BY path")
            if r[0] not in cited]
    print("\n".join(todo) if todo else "Toutes les sources indexées ont une fiche.")


def cmd_stats(con: sqlite3.Connection, args) -> None:
    for kind, n, pages in con.execute("SELECT kind, COUNT(*), SUM(pages) FROM docs GROUP BY kind"):
        print(f"{kind:7s} {n:5d} document(s), {pages or 0} page(s)")
    print(f"extraits indexés : {con.execute('SELECT COUNT(*) FROM chunks').fetchone()[0]}")
    for m, n in con.execute("SELECT matiere, COUNT(*) FROM docs GROUP BY matiere ORDER BY matiere"):
        print(f"  · {m}: {n}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--db", type=Path, default=Path(os.environ.get("KB_DB", DEFAULT_DB)))
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("ingest"); s.add_argument("--force", action="store_true")
    s = sub.add_parser("search")
    s.add_argument("query"); s.add_argument("-n", type=int, default=8)
    s.add_argument("--matiere"); s.add_argument("--raw", action="store_true", help="syntaxe FTS5 brute")
    g = s.add_mutually_exclusive_group()
    g.add_argument("--fiches", dest="kind", action="store_const", const="fiche")
    g.add_argument("--sources", dest="kind", action="store_const", const="source")
    s = sub.add_parser("page"); s.add_argument("path"); s.add_argument("page", type=int)
    s.add_argument("-c", "--context", type=int, default=0, help="pages voisines à afficher")
    sub.add_parser("vides"); sub.add_parser("todo"); sub.add_parser("stats")
    args = ap.parse_args()
    con = connect(args.db)
    {"ingest": cmd_ingest, "search": cmd_search, "page": cmd_page, "vides": cmd_vides,
     "todo": cmd_todo, "stats": cmd_stats}[args.cmd](con, args)


if __name__ == "__main__":
    main()
