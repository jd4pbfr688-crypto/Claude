---
name: corriger
description: Corrige une copie de partiel de médecine (QCM/QRM, QROC, dossiers cliniques progressifs, KFP, rédactionnel) en s'appuyant sur la base de connaissances indexée de correcteur/ ; rend une note /20, le détail par question, les erreurs sourcées dans le cours et un corrigé. Utiliser quand l'utilisateur dit « corrige », « note ma copie », « /corriger ».
---

# Corriger un partiel

Argument éventuel : chemin de la copie ou du sujet (sinon, prends les fichiers les plus
récents de `correcteur/copies/` et confirme avec l'utilisateur s'il y a un doute).

## 0. Préparer

```bash
python3 correcteur/scripts/kb.py ingest   # au cas où des cours ont été ajoutés
python3 correcteur/scripts/kb.py stats
```

Si la base est vide pour la matière concernée, dis-le : la correction reposera alors sur
tes connaissances générales, ce qui est moins fiable que le cours de l'étudiant. Propose
de lancer `/distiller` d'abord.

## 1. Lire le sujet et la copie

- Les copies peuvent être des PDF, photos ou textes. Lis-les visuellement (Read) ; pour
  une copie manuscrite, transcris chaque réponse **telle qu'écrite** avant de juger.
  Signale tout passage illisible au lieu de l'interpréter en faveur ou en défaveur de l'étudiant.
- Repère pour chaque question : le type (QRU, QRM, QRP, QROC, DP, KFP, rédactionnel),
  le nombre de points, la réponse de l'étudiant.
- Un corrigé ou barème officiel fourni par l'utilisateur **prime sur tout le reste**.
  `correcteur/bareme.json` donne les règles par défaut.

## 2. Établir la réponse attendue, question par question

Pour chaque question :
1. Cherche dans la base avec 2 à 4 mots-clés précis (sigles inclus) :
   `python3 correcteur/scripts/kb.py search "embolie pulmonaire score Wells" -n 6`
   Essaie plusieurs formulations si les premiers résultats ne conviennent pas.
2. Ouvre les meilleures pages : `kb.py page <chemin> <n> -c 1`, ou la fiche correspondante.
3. Établis la réponse attendue en citant la source : `[sources/pneumo/poly.pdf p.42]`.
   Si le cours ne couvre pas la question, réponds avec tes connaissances en le signalant
   `(hors cours)`, et baisse ta confiance.

Ne note jamais une question sans avoir d'abord établi la réponse attendue.

## 3. Noter

- **QCM** : ne calcule pas de tête. Écris un fichier TSV
  (`num<TAB>type<TAB>clé<TAB>réponse<TAB>pmz`) dans `correcteur/corrections/` et lance :
  `python3 correcteur/scripts/qcm.py --fichier <fichier.tsv>`.
- **QROC / rédactionnel / dossiers** : liste les éléments attendus avec leurs points
  (mots-clés obligatoires, éléments importants, éléments bonus), puis coche ce que
  l'étudiant a fourni. Accepte les synonymes et formulations équivalentes ; ne pénalise pas
  l'orthographe médicale approximative si le sens est sans ambiguïté.
- **Réponse dangereuse** (contre-indication majeure, geste qui met en danger le patient,
  urgence non reconnue) : 0 à la question et signalement explicite ⛔.
- Note finale ramenée sur 20, avec le total brut affiché.
- En cas d'ambiguïté réelle (question mal posée, cours qui se contredit), donne le
  bénéfice du doute et signale-le.

## 4. Rendre la correction

Écris `correcteur/corrections/AAAA-MM-JJ-<matiere>-<intitule>.md` :

```markdown
# Correction — <matière> — <intitulé du partiel>
**Note : 13,4 / 20** (brut 40,2 / 60) · confiance : élevée | moyenne | faible

## Synthèse
- 3 points forts, 3 lacunes prioritaires (avec la fiche ou les pages à revoir).

## Détail par question
| Q | Type | Réponse | Attendu | Points | Commentaire |
|---|------|---------|---------|--------|-------------|

### Q3 — <énoncé abrégé>   (0,5 / 1)
- Ta réponse : …
- Attendu : … [source p.N]
- Erreur : … → à revoir : fiches/<matiere>/<fiche>.md

## Corrigé type
Réponses modèles complètes, sourcées.

## À réviser en priorité
Liste ordonnée des notions manquées, avec les pages ou fiches correspondantes.
```

Présente ensuite à l'utilisateur la note, la synthèse et le lien vers le fichier.
Pour les points incertains, détaille ton raisonnement plutôt que de trancher en silence.
Commite la correction si l'utilisateur le souhaite.
