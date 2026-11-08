# Statistiques probabilistes 2 : Tests d'hypothèses

Diaporama animé du tutorat PASS (UE4), d'après le poly du Pr Morin, parties II à V.
Même moteur que le cours 1 : un plan infini où chaque rangée est une partie du cours et chaque cadre 1920 × 1080 une diapo.

- `statistiques-probabilistes-2.html` : le diaporama assemblé (c'est le fichier publié).
- `src/` : les morceaux. `01`, `03`, `04`, `05`, `08` viennent du cours 1 sans modification de fond ;
  `07a-data.js` (données), `07b-bell.js` (la cloche du test), `07c` à `07e` (les scènes, une par diapo).
- `build.py` : assemble le diaporama. `python3 build.py`
- `donnees.py` : recalcule tous les nombres affichés ; `fiche-donnees.txt` en est la sortie.
- `export.js` : une image par étape, le PDF vectoriel (une page par étape) et le parcours de tous les clics.
  `node export.js statistiques-probabilistes-2.html <sortie> <anime.umd.min.js> <dossier des polices Inter> all`
- `planches.py` : planches de contrôle (4 étapes par image).
- `web/` : la page qui présente les cours et propose le PDF.

Clavier : → ou espace avancer, ← revenir, ↓ rejouer l'étape, O carte du cours, F plein écran, E éditer.
