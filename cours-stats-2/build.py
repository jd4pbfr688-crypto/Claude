#!/usr/bin/env python3
"""Assemble le diaporama « Statistiques probabilistes 2 : Tests d'hypothèses ».

Le moteur (caméra sur un plan infini, étapes, mode édition) vient du cours 1, à l'identique,
extrait dans src/ ; les scènes de ce cours sont dans src/07*.js.
Usage : python3 build.py [nombre de diapos]   (par défaut : toutes celles qui ont une scène)
"""
import re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / 'src'
OUT = HERE / 'statistiques-probabilistes-2.html'

# (clé, nom, scène, rangée) — une rangée = une partie du cours ; dans une rangée, on va vers la droite
STATIONS = [
    ('TITRE', 'Titre', 'titre', 0),
    ('QUESTION', 'La question du fabricant', 'question', 0),
    ('HYPO', 'H₀ et H₁', 'hypo', 0),
    ('RAISON', 'Le raisonnement', 'raison', 0),
    ('ALPHA', 'Le risque α', 'alpha', 0),
    ('ALPHA1', 'Et à 1 % ?', 'alpha1', 0),
    ('BETA', 'Le risque β', 'beta', 0),
    ('ERREURS', 'Les deux erreurs', 'erreurs', 0),
    ('EPS', 'Le raccourci ε', 'eps', 1),
    ('UNI', 'Le test unilatéral', 'uni', 1),
    ('PVAL', 'Le degré de signification p', 'pval', 1),
    ('METHODE', 'La méthode', 'methode', 1),
    ('CFREQ', 'Conformité d\'une fréquence', 'cfreq', 1),
    ('CMOY', 'Conformité d\'une moyenne', 'cmoy', 1),
    ('CVAR', 'Conformité d\'une variance', 'cvar', 1),
    ('HOMO', 'Conformité ou homogénéité ?', 'homo', 2),
    ('HFREQ', 'Homogénéité de deux fréquences', 'hfreq', 2),
    ('HVAR', 'Homogénéité de deux variances', 'hvar', 2),
    ('HMOY', 'Homogénéité de deux moyennes', 'hmoy', 2),
    ('CHI2', 'Le χ² pas à pas', 'chi2', 3),
    ('CHI22', 'χ² et homogénéité', 'chi22', 3),
    ('BILAN', 'Bilan : quel test ?', 'bilan', 3),
]
CHAPTERS = [
    ('II', 'Position du problème', 'H₀, H₁, les risques α et β'),
    ('III', 'Tests de conformité', 'un échantillon face à une valeur'),
    ('IV', 'Tests d\'homogénéité', 'deux échantillons entre eux'),
    ('V', 'Le test du χ²', 'et le bilan'),
]
DX, DY = 2300, 1450

def main():
    scenes = ''.join((SRC / f).read_text() for f in sorted(p.name for p in SRC.glob('07*.js')))
    defined = set(re.findall(r"stepped\('([a-z0-9]+)'", scenes))
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else len(STATIONS)
    rows = [s for s in STATIONS[:limit] if s[2] in defined]

    col = {}
    secs = []
    for i, (key, name, scene, row) in enumerate(rows):
        c = col.get(row, 0); col[row] = c + 1
        x, y = c * DX, row * DY
        fly = ' data-fly="dive"' if c == 0 and row > 0 else ''
        secs.append(f'    <section class="station" id="s{i+1}" data-key="{key}" data-name="{name}" data-x="{x}" data-y="{y}" data-scene="{scene}"{fly}>\n'
                    f'      <svg class="stage" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="{name}"></svg>\n    </section>')
    chaps = []
    for r in sorted(col):
        num, title, sub = CHAPTERS[r]
        chaps.append(f'    <div class="chapter" data-x="{-DX}" data-y="{r*DY}" style="transform: translate({-DX}px, {r*DY}px)">'
                     f'<div class="ch-num">{num}</div><div class="ch-title">{title}</div><div class="ch-sub">{sub}</div></div>')

    head = (SRC / '01-head-css.html').read_text()
    head = head[head.index('-->') + 3:]            # drop the course-1 header comment
    head = head.replace('</style>', '') if head.rstrip().endswith('</style>') else head
    extra_css = (SRC / '02-extra.css').read_text()
    engine = (SRC / '04-engine.js').read_text()
    engine = engine.replace("'stats-proba-edits-v1'", "'stats-proba-2-edits-v1'")
    engine = engine.replace(
        "    const pad = 200;\n    const minX = Math.min(...stations.map(s => s.x)) - pad",
        "    const pad = 200, chs = [...document.querySelectorAll('.chapter')].map(c => +c.dataset.x);\n"
        "    const minX = Math.min(...stations.map(s => s.x), ...chs) - pad")
    assert "chs = [" in engine, 'overview patch failed'
    # rich text: multi-character subscripts written _{e1} (S_{e1}², C_{11}…), also when re-edited in edit mode
    for a, b in [
        ("seg.split(/(_[A-Za-z0-9α])/)", "seg.split(/(_\\{[^}]*\\}|_[A-Za-z0-9α])/)"),
        ("sub = q.length === 2 && q[0] === '_';", "sub = q[0] === '_' && (q.length === 2 || q[1] === '{');"),
        ("S('tspan', a, t).textContent = sub ? q[1] : q;", "S('tspan', a, t).textContent = sub ? (q[1] === '{' ? q.slice(2, -1) : q[1]) : q;"),
        ("out += sub ? '_' + x.textContent :", "out += sub ? (x.textContent.length > 1 ? '_{' + x.textContent + '}' : '_' + x.textContent) :"),
    ]:
        assert engine.count(a) == 1, a
        engine = engine.replace(a, b)
    # overview = the map of the course: every frame shows its last step (they are all mounted)
    old = "    document.body.classList.add('is-overview');\n"
    assert engine.count(old) == 1
    engine = engine.replace(old, old + "    stations.forEach((s, i) => { const sc = sceneOf(s); if (i !== cur && s.mounted && sc && sc.labels) sc.set(s.el, sc.labels.length - 1); });\n")
    html = (
        '<title>Statistiques probabilistes 2</title>\n'
        + (SRC / '00-header.html').read_text()
        + head + extra_css + '</style>\n\n'
        + '<div id="viewport">\n  <div id="world">\n' + '\n'.join(chaps + secs) + '\n  </div>\n</div>\n\n'
        + (SRC / '03-hud.html').read_text()
        + '<script>document.documentElement.dataset.live = "all";</script>\n'
        + '<script src="https://cdn.jsdelivr.net/npm/animejs@4.4.1/dist/bundles/anime.umd.min.js"></script>\n'
        + engine
        + (SRC / '07a-data.js').read_text()
        + (SRC / '05-helpers.js').read_text()
        + ''.join((SRC / f).read_text() for f in sorted(p.name for p in SRC.glob('07*.js')) if f != '07a-data.js')
        + '\n' + (SRC / '08-input-boot.js').read_text()
        + '</script>\n'
    )
    OUT.write_text(html)
    print(f'{OUT.name}: {len(rows)} diapos, {len(html)//1024} Ko')

if __name__ == '__main__':
    main()
