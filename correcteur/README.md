# Correcteur de partiels (médecine)

Base de connaissances locale construite à partir de **tes** polys, et correction de copies
sourcée dans ces cours.

## Fonctionnement

```
sources/  ──distiller──▶  fiches/  ──┐
   │                                 ├──▶  index/kb.sqlite (FTS5, BM25)  ──▶  /corriger  ──▶  corrections/
   └─────────────────────────────────┘
```

1. **Sources** : dépose tes polys PDF dans `sources/<matiere>/` (ex. `sources/cardio/`,
   `sources/pneumo/`). Le nom du sous-dossier sert de filtre de matière.
2. **Distillation** (`/distiller`) : Claude lit chaque poly en entier et en tire des fiches
   structurées dans `fiches/<matiere>/`, avec la page source de chaque notion. Les pages
   scannées sont transcrites visuellement.
3. **Index** : sources et fiches sont découpées en extraits et indexées en plein texte
   (insensible aux accents, recherche par racine). Avec ~1 500 caractères par extrait, des
   milliers de pages restent interrogeables en quelques millisecondes.
4. **Correction** (`/corriger`) : dépose le sujet et ta copie (PDF, photos ou texte) dans
   `copies/`. Claude cherche dans l'index la réponse attendue à chaque question, note
   selon `bareme.json` (calcul des QCM par script) et écrit la correction dans
   `corrections/`.

## Commandes utiles

```bash
python3 correcteur/scripts/kb.py ingest                          # indexer (incrémental)
python3 correcteur/scripts/kb.py search "BNP insuffisance cardiaque" --matiere cardio
python3 correcteur/scripts/kb.py page sources/cardio/poly.pdf 42 -c 1
python3 correcteur/scripts/kb.py vides                           # pages scannées à transcrire
python3 correcteur/scripts/kb.py todo                            # polys sans fiche
python3 correcteur/scripts/qcm.py --cle ACD --rep AC             # → 0.50 (1 discordance)
```

Dépendances : Python 3 et `pdftotext` (poppler-utils), ou `pypdf` en repli.
L'index (`index/`) n'est pas versionné : `ingest` le reconstruit.

## Barème

`bareme.json` reprend par défaut la notation EDN des QRM : 0 discordance = 1 pt,
1 = 0,5, 2 = 0,2, 3 ou plus = 0, et 0 si une réponse inacceptable (PMZ) est cochée.
Adapte-le aux règles de ta fac. Un corrigé ou barème officiel déposé avec la copie
prime toujours.

## Limites

- Le correcteur ne vaut que ce que valent les sources : plus tes polys sont complets
  (et accompagnés d'annales corrigées), plus la correction est juste.
- Les réponses données hors cours sont signalées `(hors cours)`, avec un niveau de confiance.
- GitHub refuse les fichiers de plus de 100 Mo : découpe les très gros PDF.
