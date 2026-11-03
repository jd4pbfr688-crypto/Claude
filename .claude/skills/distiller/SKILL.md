---
name: distiller
description: Distille les polys/cours de médecine déposés dans correcteur/sources/ en fiches de révision structurées (correcteur/fiches/), puis réindexe la base de connaissances. Utiliser quand l'utilisateur ajoute des cours, dit « distille », « fais les fiches », « indexe mes cours ».
---

# Distiller les cours en fiches

Objectif : transformer des centaines de pages de polys en fiches denses, fidèles et
**sourcées page par page**, qui serviront de référence pour corriger les partiels.
Tout se passe dans `correcteur/` (voir `correcteur/README.md`).

## 1. Indexer et repérer le travail

```bash
python3 correcteur/scripts/kb.py ingest     # indexe sources/ et fiches/ (incrémental)
python3 correcteur/scripts/kb.py vides      # pages scannées sans texte
python3 correcteur/scripts/kb.py todo       # sources pas encore distillées
```

- **Pages sans texte (scans)** : lis-les visuellement (outil Read sur le PDF avec
  `pages`, 20 max par appel), transcris-les fidèlement dans
  `correcteur/sources/<matiere>/<nom-du-pdf>.transcription.md` avec un titre
  `## Page N` par page, puis relance `ingest`. Ne devine jamais un mot illisible :
  écris `[illisible]`.
- Si l'utilisateur a nommé un cours précis, traite celui-là ; sinon prends la liste `todo`
  dans l'ordre. Pour un gros lot, traite un poly à la fois et fais un commit par poly.

## 2. Lire le poly en entier

Lis le texte page par page (`kb.py page <chemin> <n> -c 2` ou Read sur le PDF). Les
tableaux, schémas et encadrés « à retenir » se lisent mieux visuellement : ouvre ces
pages avec Read pour ne pas perdre d'information. Ne distille jamais un poly que tu n'as
pas lu en entier.

## 3. Écrire une fiche par item ou chapitre

Fichier : `correcteur/fiches/<matiere>/<item-ou-chapitre>.md` (minuscules, tirets).
`<matiere>` reprend le sous-dossier de la source (ex. `cardio`). Gabarit :

```markdown
---
source: sources/cardio/poly-cardio-2026.pdf
pages: 12-31
matiere: cardio
item: 234 — Insuffisance cardiaque de l'adulte    # si item EDN connu
mots_cles: [insuffisance cardiaque, FEVG, BNP, NT-proBNP, IEC, bêtabloquant]
---

# Insuffisance cardiaque de l'adulte

## À retenir absolument
- Les 5 à 10 notions qu'un correcteur exigerait, chacune avec [p.N].

## Définitions
## Épidémiologie (chiffres clés)
## Physiopathologie
## Diagnostic (clinique, paraclinique, critères, scores)
## Diagnostics différentiels
## Prise en charge (1re intention, posologies, contre-indications, surveillance)
## Complications / pronostic
## Pièges et erreurs classiques
- Ce qu'un étudiant confond ou oublie ; réponses dangereuses (« PMZ »).

## Questions types
- 3 à 6 questions (QRM/QROC) avec réponse attendue et [p.N], utiles pour calibrer.
```

Règles de distillation :
- **Fidélité au poly avant tout** : la référence du correcteur, c'est le cours de
  l'étudiant. Reprends les chiffres, seuils, posologies et classifications **exactement**
  comme dans le poly, avec [p.N] sur chaque affirmation importante.
- Si tes connaissances générales contredisent le poly ou le complètent utilement, ajoute
  une ligne `> ⚠ Hors poly : …` sans modifier le contenu du poly.
- Omets les sections du gabarit sans contenu ; n'invente rien pour les remplir.
- Vise environ 5 à 10 fois moins de texte que la source, sans perdre de notion évaluable.

## 4. Réindexer, vérifier, committer

```bash
python3 correcteur/scripts/kb.py ingest
python3 correcteur/scripts/kb.py search "<2-3 mots-clés de la fiche>" --fiches -n 3
```

La fiche doit ressortir dans les premiers résultats. Commite les fiches et les
transcriptions (l'index `correcteur/index/` est ignoré par git et se reconstruit).
Résume à l'utilisateur : polys traités, nombre de fiches, pages illisibles ou incertaines.
