# SYNTHÈSE : informatique médicale (Pr Stindel), référence pour le feedback des QCM

Détails dans `01` (colles), `02` (annales), `03` (cours actuel). Cette page en est le condensé.

## 1. Programme 2026-2027
**AU PROGRAMME**
- **Introduction** : informatique = Information + Automatique, traitement automatique de l'information ;
  données = description élémentaire, souvent codée ; support = stockage (papier, film, disque dur ; on ne sait
  plus lire certains supports alors qu'on lit des papyrus) ; information = **immatérielle**, hors support,
  **liée à la transmission d'un message**, permet de **percevoir l'environnement**, **de nature à changer une
  décision = théorie de la DÉCISION** ; **théorie de l'INFORMATION** = mesure de la quantité d'information
  (mesurable), non proportionnelle au contenu (Médor chien / quadrupède).
- **Codage (définitions seulement)** : 0 = pas de tension / 1 = tension ; bit = 2 valeurs, plus petite quantité
  d'information (0 = fermeture, 1 = ouverture) ; octet = byte = 8 éléments binaires traités comme un tout ;
  256 valeurs, de 0 à 255 ; n bits → 2ⁿ ; 16 bits → 65 536 ; bit ≠ byte. ⚠️ « Pas de questions au concours
  sur le codage binaire » (annonce) → **déconseillé**.
- **IA (cœur du programme)** :
  - PubMed : 1er article en **1951** ; **< 10/an** jusqu'en 1980 ; **> 1 000/an** en 1998 ; **> 10 000/an** en 2018 (**explosion**) ; **68 000** sur les 8 premiers mois de 2025 (≈ 100 000).
  - IA = théories et techniques capables de **simuler certains traits de l'intelligence humaine** ; **pas une chose en soi mais un assemblage de méthodes** (maths, logique, systèmes complexes, capteurs, sciences cognitives).
  - **Machine learning** = méthodes permettant à une machine d'**évoluer grâce à un processus d'apprentissage** (stats, probabilités). **Deep learning** = machine learning fondé sur des **réseaux de neurones**.
  - Neurone biologique : excitabilité, conductivité. **Neurone formel de McCulloch-Pitts, 1943** : stimuli → synapse → fonction d'activation → axone → décision.
  - S = x·w (x = valeur numérique, w = **poids = importance**) ; **Σ(xᵢwᵢ) > w₀ (seuil d'activation) → activé = classe 1 ; < w₀ → classe 2** → **classification binaire**.
  - Réseau : entrée → couches **cachées** (inexplicables) → sortie = **probabilités** ; perceptron ; on **adapte les poids** pour que la décision corresponde à la vérité.
  - Exemple **élections 2017** (âge, revenu, CSP, sexe) ; sorties 0,12 / **0,63 → droite** / 0,25 ; **phase d'apprentissage = impact majeur** → risque de **biais** (« toutes les décisions dépendent de la façon dont on a fait apprendre »).
  - **Supervisé** : jeu de données **restreint**, réponses **connues**, caractéristiques des classes, nombre de classes **fixé a priori**, **subjectivité du classifieur** (exemple : « ceci est un chat »).
    **Non supervisé** : jeu de données **important**, réponses **inconnues**, **clusters**, nombre de classes **non fixé**, **détection de nouvelles classes**, parfois des **classes aberrantes**. Exemples : cancer du sein, indexation d'images, Captcha.
  - Catégories : **descriptive** (données massives, tendances, rapports, tableaux de bord) / **prédictive** (modèles, apprentissage automatique, prédiction d'événements) / **prescriptive-générative** (nouvelles données, images, textes).
  - Entrepôt (2013) : le DPI (comptes rendus, labo, PACS, DSI, PMSI, radio) → requête structurée / plein texte, index, métadonnées, ETL, EAI. Les données sont **dupliquées** ; elles relèvent du **soin courant** et servent les études en **vie réelle**.
  - **HUGO** : **6 hôpitaux, 5,1 M de patients, 1,3 milliard de données**, **1er réseau européen** de big data en santé.
  - CHU de Brest : **12 solutions** d'IA. AVICENNA.AI (hémorragies intracrâniennes, **−60 %** de temps d'interprétation, priorisation des cas critiques) ; INCEPTO (BoneView et ChestView, fractures) ; PYLCLARI.AI (TEP prostate, segmentation, quantification de dose, ganglions) ; HOPIA (vacations de bloc) ; PRAEVAorta 2 (chirurgie vasculaire) ; OSO AI (EHPAD, **audio**, chutes et détresse) ; PIXACARE (plaies) ; Mistral AI (50 licences) ; Copilot 365 (20 licences) ; GED-I ; LIFEN (correspondance) ; SWEEPIN (guidage intérieur).

**RETIRÉ (hors programme)** : unité centrale, ROM, RAM, ports E/S, bus de données, multiples de l'octet,
méthode de conversion, SIH, interconnexion / 70 % de libéraux, DPI/DMI (au sens des applications médicales), carte Vitale,
Medline / MeSH / thésaurus, bloc opératoire assisté par ordinateur.

## 2. Déjà posé : ne pas reproduire
- **Examen déc. 2025 (IA)** : deep learning = réseaux de neurones artificiels ; deep learning ⊂ apprentissage
  automatique ; « neurone artificiel récent, < 10 ans » (F, 1943) ; reconnaissance d'organes en imagerie ;
  entrepôts = clones du SIH ? / données massives pour entraîner des réseaux de neurones / études en vie réelle / soin courant.
- **Introduction, déjà vue en colle et à l'examen** : information immatérielle (vs matérielle) ; données = description
  élémentaire ; « changer une décision » attribué à la mauvaise théorie ; mesurable ; Médor ; support = stockage ;
  Information + Automatique.
- **Codage déjà vu** : 0-255 vs 1-256 ; 8 bits vs 8 bytes ; bit = 2 vs 4 valeurs ; 16 bits = 65 535 ; 1 Ko ;
  conversions 197, 123, 170, 211, 74, 106, 13, 99, addition 13 + 17 = 30.

## 3. Style Stindel
- Consigne : « Vous noircirez la (les) proposition(s) exacte(s) » ; E = « Aucune des précédentes propositions n'est exacte ».
- Énoncé = **sujet nominal court** (« À propos du deep learning », « Les entrepôts de données de santé : »), puis 4 items
  courts qui complètent la phrase ; ou un **QCM mixte**.
- Items **« texto cours »**, une idée chacun ; un item faux se fabrique en changeant **un mot** : chiffre ou date, terme jumeau,
  **adverbe** (uniquement, toujours, récent), catégorie. **Pas de mise en situation** en informatique.
- Grilles à 3 ou 4 items vrais fréquentes (ABCD, ACD). **Recyclage** mot pour mot d'une année sur l'autre. Il aime les **exemples**.
- 2 QCM d'informatique en fin de sujet (Q19-Q20), après la recherche clinique.

## 4. Grille de feedback (pour chaque QCM)
1. **Programme** : la notion est-elle au programme actuel ? Les notions retirées sont signalées.
2. **Originalité** : ressemble-t-il à une colle (2022-26) ou à une annale (2020-25) ? Le concept et la forme comptent, pas seulement les valeurs.
3. **Exactitude** : chaque V/F est-il conforme au cours (mot pour mot si possible) ? La correction est-elle juste et sans ambiguïté ?
4. **Style** : est-il proche de Stindel (court, un piège par item, pas de double négation) ?
5. **Équilibre** : nombre de vrais, E plausible, pièges pas trop grossiers.

## 5. Erreurs connues des corrections du tutorat
- Colle 23-24 Q20 → la bonne réponse est E (et non A). Colle 24-25 Q20 → ACD (et non AC).
- Annale déc. 2021 Q19 → BCD. Annale déc. 2024 Q17 C : précision ≠ justesse (discutable).
- Annale déc. 2025 Q20 : contesté entre ACD et BCD ; mon avis : BCD.
