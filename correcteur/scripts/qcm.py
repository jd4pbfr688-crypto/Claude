#!/usr/bin/env python3
"""Notation déterministe des QCM (évite les erreurs de calcul à la main).

Règles lues dans correcteur/bareme.json (modifiable selon ta fac).

Usage :
  python3 correcteur/scripts/qcm.py --cle ACD --rep AC                    # une question QRM
  python3 correcteur/scripts/qcm.py --cle B --rep B --type QRU
  python3 correcteur/scripts/qcm.py --cle ACD --rep ACE --pmz E           # E = réponse inacceptable
  python3 correcteur/scripts/qcm.py --fichier correcteur/copies/qcm.tsv   # lot : num<TAB>type<TAB>clé<TAB>réponse[<TAB>pmz]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

BAREME = Path(__file__).resolve().parent.parent / "bareme.json"


def load_rules() -> dict:
    return json.loads(BAREME.read_text(encoding="utf-8"))["qcm"]


def letters(s: str) -> set[str]:
    return {c for c in s.upper() if c.isalpha()}


def score(qtype: str, cle: str, rep: str, pmz: str, rules: dict) -> tuple[float, int, str]:
    r = rules[qtype]
    options = r.get("options", "ABCDE")
    k, a, bad = letters(cle), letters(rep), letters(pmz)
    if not a:
        return 0.0, -1, "aucune réponse cochée"
    if a & bad:
        return 0.0, -1, f"réponse inacceptable cochée ({''.join(sorted(a & bad))})"
    if r["mode"] == "tout_ou_rien":
        ok = a == k
        return (1.0 if ok else 0.0), (0 if ok else len(a ^ k)), "exact" if ok else "faux"
    disc = sum(1 for o in options if (o in k) != (o in a))  # case cochée à tort ou oubliée
    table = r["points_par_discordances"]
    pts = table[str(disc)] if str(disc) in table else table.get("autre", 0.0)
    return float(pts), disc, f"{disc} discordance(s)"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cle"); ap.add_argument("--rep", default="")
    ap.add_argument("--type", default="QRM"); ap.add_argument("--pmz", default="")
    ap.add_argument("--fichier", type=Path)
    args = ap.parse_args()
    rules = load_rules()
    if args.fichier:
        total = n = 0
        for line in args.fichier.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.startswith("#"):
                continue
            f = line.split("\t") + [""] * 5
            pts, _, why = score(f[1].strip() or "QRM", f[2], f[3], f[4], rules)
            total += pts; n += 1
            print(f"Q{f[0]:>3}  {f[1] or 'QRM':4} clé={f[2]:6} rép={f[3]:6} → {pts:.2f}  ({why})")
        if n:
            print(f"\nTotal : {total:.2f} / {n}  →  {20 * total / n:.2f} / 20")
    else:
        if not args.cle:
            ap.error("--cle ou --fichier requis")
        pts, _, why = score(args.type, args.cle, args.rep, args.pmz, rules)
        print(f"{pts:.2f} point ({why})")


if __name__ == "__main__":
    main()
