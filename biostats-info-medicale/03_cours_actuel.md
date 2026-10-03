# Cours d'informatique médicale (Pr Stindel) : version actuelle annotée

Source : support du tutorat (« Informatique médicale », basé sur le cours de l'année précédente), annoté à la
main par l'étudiant pendant le cours de cette année (2026-2027), avec des photos des diapositives sur l'IA.
PDF de 19 pages.

> **Interprétation à confirmer avec l'étudiant** : les parties **barrées** à la main semblent
> **retirées du cours cette année**. La **page 4** du support (RAM, ports E/S, bus de données) est
> **absente** du PDF (le sommaire l'annonce). Elle a soit été retirée, soit perdue à la compression.

---

## 1. Parties conservées (non barrées)

### I. Introduction (conservée)
- Informatique = contraction de **Information + Automatique** ; science du **traitement automatique de
  l'information**. Ordinateur = machine électronique de traitement de l'information.
- **Données** = description élémentaire, souvent **codée**, d'une chose ou d'un événement.
- **Support** = élément de stockage des données (papier, film, disque dur…).
  - Ajout manuscrit : « on n'est plus capable de lire certains supports alors qu'on peut lire des papyrus ».
- **Information** = notion **immatérielle**, existe en dehors d'un support physique ; concept étroitement
  lié à la **transmission d'un message** ; au sens commun, elle permet de **percevoir l'environnement** ;
  c'est ce qui est **de nature à changer une décision (théorie de la décision)**. Exemple : chaud ou froid dehors → changer de vêtements.
  - ⚠️ Donc l'item 22-23 Q17A (colle) « transmission d'un message » est **vrai d'après le cours** ; seul « matérielle » est faux.
- **Théorie de l'information** (théorie mathématique) : mesure la quantité d'information d'un message ;
  l'information est **mesurable**. Médor chien / quadrupède. La quantité d'information **n'est pas toujours
  proportionnelle au contenu**.

### III. Codage de l'information (conservé, mais voir l'annotation)
- Annotation manuscrite en haut de la section : **« pas de questions dans le concours sur le codage binaire »**.
  → Probablement une annonce du professeur. C'est une rupture nette avec les annales (conversions tombées en 2020, 2023, 2024).
- Le processeur ne gère que des informations binaires : **0 = pas de tension, 1 = tension**.
- **Bit** (binary digit, nombre binaire) = unité binaire de quantité d'information, **2 valeurs** ;
  0 = fermeture, 1 = ouverture du composant ; **plus petite quantité d'information**.
- **Octet / byte** = ensemble ordonné de **8 éléments binaires traités comme un tout** ; 2⁸ = 256
  possibilités, **de 0 à 255**. Avec n bits → 2ⁿ messages ; 2 octets = 16 bits = 65 536 possibilités.
- **Bit ≠ byte** ; 1 byte = 8 bits.
- Barré : multiples (Ko = 1024 o = 2¹⁰, Mo = 2²⁰, Go = 2³⁰, To = 2⁴⁰) et le paragraphe
  « méthode de conversion » + tableau des puissances. L'encadré exemple 11111111 = 255 n'est **pas** barré ;
  exemples manuscrits : 00101000 = 40, 10001011 = 139. Exemples du support : 137, 40, 139.

---

## 2. Parties barrées (probablement retirées cette année)
- **II.A Unité centrale / microprocesseur** (circuit intégré, programme, reçoit des informations et émet des ordres, calculs).
- **II.B ROM** (programme de gestion du système, non labile, non réinscriptible, flashage, mnémo « O »).
- **Page 4 manquante** : II.C RAM, II.D Ports E/S, II.E Bus de données.
- **IV. Applications médicales** en entier : SIH, interconnexion (70 % de libéraux), DPI/DMI, contexte
  économique (carte Vitale), bases de données de santé des populations, systèmes documentaires, **Medline
  + MeSH + définition du thésaurus**, informatique au bloc opératoire (chirurgie assistée par ordinateur, capteurs).

→ Si l'interprétation est juste, **l'architecture de l'ordinateur, Medline et le codage binaire calculatoire
ne seraient plus au programme**. Or c'est exactement ce que le prof posait jusqu'ici (ROM 2023, RAM 2024, bus 2022, binaire 2020/2023/2024).

---

## 3. NOUVEAU : Intelligence artificielle (notes manuscrites + diapositives)

### 3.1 Historique (diapositive « Concepts anciens… Appropriation récente », articles IA dans PubMed)
- **1951** : 1er article (la note manuscrite dit « en 1950, premiers articles qui parlent d'IA »).
- Jusqu'en **1980** : **< 10 articles/an**.
- **1998** : **> 1 000/an**.
- **2018** : **> 10 000/an** → **explosion vers 2018**.
- **2025** : **68 000** sur les 8 premiers mois → « maintenant 100 000 ».
- PubMed = base de données d'articles médicaux.

### 3.2 Définitions
- **IA** : « ensemble de théories et de techniques mises en œuvre capables de **simuler certains traits de
  l'intelligence humaine** ». Ce n'est **pas une chose en soi** mais un **assemblage de méthodes**.
  (La note dit « IA : 2 définitions » ; une seule est écrite.)
- Techniques mobilisées : **mathématiques**, **logique** (« cousine des maths »), **science des systèmes
  complexes** (on ne sait pas ce qui va sortir en fonction de ce qui entre), **capteurs** (acquérir,
  « capter » l'information), **sciences cognitives**. Tout cela forme un ensemble.
- **Machine learning** : **ensemble des méthodes qui permettent à une machine d'évoluer grâce à un
  processus d'apprentissage**. Elle ne peut pas évoluer toute seule. Beaucoup de **stats et de probabilités**.
- **Deep learning** : méthode de machine learning **basée sur des réseaux de neurones** (« personne n'y
  comprend rien »).

### 3.3 Du neurone biologique au neurone formel
- Neurone biologique : **excitabilité**, **conductivité**.
- **Neurone formel de McCulloch-Pitts, 1943** : conceptualisation du neurone « électrique ».
  Schéma : stimulus 1 et 2 → **synapse** → A → **axone** → **décision** ; **fonction d'activation**.
- La fonction d'activation mélange ce qui est arrivé et ce qui s'est passé au milieu, puis **prend une décision**.
- La nature des stimuli joue sur la décision (exemple : viande ou poisson ?). Il y a beaucoup
  d'informations, donc on choisit selon leur importance et on privilégie la plus pertinente → un **poids variable pour chaque information**.
- Diapositive « Fonction d'activation » :
  - Stimulus **S = x·w** ; x = **valeur numérique** ; w = **poids (importance)** ;
  - n stimuli = **paramètres d'entrée** ; somme **Σ(xᵢ·wᵢ) = (x₁·w₁)+…+(xₙ·wₙ)** ; « fonction de transfert » ;
  - **seuil d'activation w₀**, fonction **binaire** (marche 0 → 1) ;
  - **Σ(xᵢ·wᵢ) > w₀ → neurone activé (classe 1)** ; **Σ(xᵢ·wᵢ) < w₀ → non activé (classe 2)** ;
  - → **classification binaire** : 2 classes selon l'activité ou non du neurone ; pondération des paramètres.

### 3.4 Réseau de neurones et apprentissage
- Diapositive « Réseau de neurones » : **entrée** → **1re couche cachée** → **2e couche cachée** →
  **sortie = probabilités** ; mention du **perceptron** (x₁w₁ + x₂w₂ → Y).
  Les couches cachées : « personne n'arrive à les expliquer ».
- On **adapte les poids** pour que la décision **corresponde à une vérité**. « 1 neurone, des entrées, des
  poids, des résultats près de la réalité ».
- Exemple : **élections présidentielles 2017**. Données : âge, revenus, CSP, sexe, vote (gauche / droite / autre).
  - On **injecte des paramètres pour faire apprendre** le système = **phase d'apprentissage** → on **règle les poids** pour associer une probabilité de vote à un individu donné.
  - Exemple chiffré : poids 2 (âge = 35), 4 (revenu = 100 000), 1 (CSP = 2), 1 (sexe = M) → sorties
    **0,12 / 0,63 / 0,25** → « Droite » (la plus forte probabilité).
- **Fonctionnement probabiliste.**
- La **phase d'apprentissage a un impact majeur**, très importante (« +++ ») pour définir le comportement du
  modèle → risque d'un **système de réflexion biaisé** : **toutes les décisions dépendent de la façon dont on a fait apprendre le système**.

### 3.5 Deux façons de faire apprendre : supervisé et non supervisé
| | **Apprentissage supervisé** | **Apprentissage non supervisé** |
|---|---|---|
| Jeu de données | **plus restreint** | **important** |
| Réponses attendues | la machine **connaît déjà** les réponses qu'on attend d'elle | la machine **ne connaît PAS** les réponses |
| Ce qu'elle fait | détermine les **caractéristiques des différentes classes** | détermine des **clusters (classes)** |
| Nombre de classes | **fixé a priori** | **pas fixé** ; permet la **détection de nouvelles classes** |
| Limite / particularité | **subjectivité du classifieur** | détecte parfois des **classes aberrantes** |
| Exemple oral | « je lui donne une image de chat et je dis que c'est un chat » → associe les calculs statistiques à la réalité que je décris | |

Exemples notés (en vert, rattachement à l'un ou l'autre non précisé) : **diagnostic du cancer du sein**,
**indexer des images**, **Captcha**.

### 3.6 Catégories d'IA (diapositive « Catégories »)
- **Descriptive** : analyse de données massives, identification de tendances, production de rapports et de graphiques, tableaux de bord.
- **Prédictive** : utilisation de modèles, apprentissage automatique, prédiction d'événements.
- **Prescriptive / Générative** : crée de **nouvelles données**, création d'images, rédaction de textes.

### 3.7 Données massives et entrepôts (diapositives)
- **« Histoire », 2013** : le **DPI** (comptes rendus, labo, PACS, DSI, PMSI, radio…) alimente un
  entrepôt de données : **requête structurée**, **requête plein texte**, **index**, **métadonnées**,
  **documents**, **ETL**, **EAI**.
- **Réseaux régionaux, données massives en santé** : « Avec **6 hôpitaux**, **5,1 millions de patients**, pour
  **1,3 milliard de données**, **HUGO** est le **premier réseau européen big data en santé** » (Grand Ouest, carte de France).

### 3.8 L'IA au CHU de Brest (diapositive « Vue d'ensemble des solutions d'IA »)
Le CHU de Brest dispose de **12 solutions** utilisant l'IA :
- **Imagerie et radiologie** : **AVICENNA.AI** (détection d'hémorragies intracrâniennes…), **INCEPTO**
  (BoneView et ChestView en radiologie), **PYLCLARI.AI** (interprétation des examens TEP, cancer de la prostate).
- **Chirurgie et blocs** : **HOPIA** (planification des vacations de bloc), **PRAEVAorta 2** (aide à la décision en chirurgie vasculaire).
- **EHPAD et surveillance** : **OSO AI** (détection audio des chutes et des situations de détresse).
- **Dermatologie et suivi des plaies** : **PIXACARE** (documentation et suivi des plaies).
- **Solutions transversales** : **Chat Team Mistral AI** (50 licences, assistant IA généraliste), **Copilot 365 Microsoft** (20 licences, productivité augmentée).
- **Documentation et communication** : **GED-I** (texte illisible), **LIFEN Documents** (correspondance dématérialisée).
- **Orientation et navigation** : **SWEEPIN** (géolocalisation et guidage intérieur).

Exemples soulignés à l'oral (notes) : **dépistage automatique des fractures aux urgences**, **cancer du sein**,
**organisation des blocs opératoires**, **EHPAD : analyse des signaux** (« l'oreille augmentée du signal »),
**Sweepin** (localise dans l'établissement). « Sans rentrer dans les détails. »
- **AVICENNA.AI** : outil de détection automatique des hémorragies intracrâniennes. Avantages clés :
  **priorisation automatique des cas critiques**, **réduction du temps d'interprétation de 60 %**,
  amélioration de la détection des **saignements subtils**.
- **PYLCLARI.AI** : **segmentation automatique**, **quantification de dose** ; met en évidence les **ganglions cancéreux** (TEP).

---

## 4. Conséquences pour les QCM

1. **Le chapitre IA est entièrement nouveau.** Aucune colle et aucune annale ne l'a jamais traité, ce qui rend la non-ressemblance facile.
   C'est probablement le cœur de l'examen de cette année, et le prof aime faire tomber les **exemples** (note du support).
2. Les colles passées portent presque entièrement sur des parties **barrées**. Des QCM sur la ROM, la RAM, le bus, Medline ou le SIH seraient
   **hors programme** si l'interprétation des ratures est juste.
3. Le codage binaire : les définitions restent au cours (bit, octet, 0-255, 2ⁿ, bit ≠ byte), mais l'annotation dit
   « pas de questions au concours sur le codage binaire ». À **éviter ou limiter** aux définitions.
4. Matière exploitable en dehors de l'IA : l'introduction (données, support, information, théorie de la décision vs
   théorie de l'information, Médor), le binaire 0 = pas de tension / 1 = tension, « plus petite quantité d'information », 2ⁿ messages.
5. Pièges typiques à fabriquer dans le style Stindel (un mot changé) :
   - dates et chiffres : 1943 (McCulloch-Pitts), 1951 / 1980 / 1998 / 2018, < 10, > 1 000, > 10 000, 68 000 ; HUGO (6 hôpitaux, 5,1 M patients, 1,3 milliard de données, 1er réseau **européen**) ; 12 solutions au CHU ; −60 % de temps d'interprétation ;
   - inversions supervisé ↔ non supervisé (jeu restreint/important, classes fixées/non fixées, subjectivité / classes aberrantes) ;
   - Σ(xᵢwᵢ) **>** w₀ → activé ; poids = importance ; x = valeur numérique ; sorties = probabilités ;
   - deep learning ⊂ machine learning ⊂ IA ; deep learning = réseaux de neurones ; machine learning = apprentissage ;
   - descriptive / prédictive / générative : attribuer un exemple à la mauvaise catégorie ;
   - solution ↔ service (OSO AI = EHPAD audio ; HOPIA = blocs ; Sweepin = guidage intérieur ; PYLCLARI = TEP prostate).
