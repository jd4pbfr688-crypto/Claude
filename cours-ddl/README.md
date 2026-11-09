# Les degrés de liberté · Tutorat PASS, UE4

Deuxième cours animé, construit avec le « Guide de construction d'un cours animé » et le moteur
du premier cours (Statistiques probabilistes).

- `degres-de-liberte.html` : le diaporama (une page, 1920 × 1080, un clic par étape), assemblé par `build.py`.
- `src/` : le moteur du premier cours, repris tel quel (`10-`, `30-`, `40-`, `50-`, `90-`), et ce qui est propre
  à ce cours (`00-head`, `15-style-ddl`, `20-stations`, `60-scenes-ddl.js` : données et 9 diapos).
- `export/` : une image par étape, le PDF (une page par étape) et la page de téléchargement.

Reconstruire et vérifier :

```bash
python3 build.py
node export.js degres-de-liberte.html export/img   # images fixes (mode ?still=1)
node walk.js degres-de-liberte.html /tmp/walk      # parcourt tous les clics en mode animé
```
