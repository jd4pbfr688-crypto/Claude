# Support tutorat dactylographié « Informatique médicale » (version avec IA), pages 97 à 111

Source : polycopié du tutorat (16 p.). Le sommaire porte la mention **« pas fait l'année dernière »** pour
**II. Architecture** et **IV. Applications médicales**. C'est cohérent avec les ratures du cours de cette année
et avec l'examen de déc. 2025 (sans architecture ni binaire). Les parties I à IV reprennent mot pour mot l'ancien support (voir `03`).
Ici : **formulations exactes du chapitre IA** (utile pour juger le « texto cours ») et **écarts avec les notes manuscrites**.

## V. Intelligence artificielle en santé

### A. Concepts anciens (appropriation récente) : PubMed
- « Le premier article qui mentionne l'IA est publié en **1950**. »
- **Entre 1951 et 1980 : < 10 articles/an** ; **1998 : > 1 000/an** ; **2018 : > 10 000/an (explosion du domaine)** ; **2025 : 68 000 articles/an**.
- « Le nombre d'articles concernant l'IA explose en 2018 cependant cela avait débuté bien longtemps avant 1950 » (phrase incohérente avec « premier article en 1950 » : **ne pas en faire un item**).
- Définition (**Larousse, 2019**) : « Ensemble des théories et des techniques mises en œuvre **en vue de réaliser des machines** capables de **simuler certains traits de l'intelligence humaine** ».
- « L'IA **n'est pas une chose en soi**, c'est une **construction** qui correspond à un **assemblage de méthodes et de théories**. »
- Citation de **Woody Allen** : « L'intelligence artificielle est définie comme le contraire de la bêtise naturelle. » (c'est la « 2e définition » des notes).

### B. Ne mélangeons pas tout !!
- « L'IA est un système utilisant des **équations tellement complexes** qu'en fonction des données apportées en entrée, **on ne sait pas toujours ce qui va sortir**. »
- Matières qui la composent :
  - **Capteurs** : acquérir l'information qui va nourrir les algorithmes ;
  - **Mathématiques** : l'IA ne peut pas exister sans les mathématiques ;
  - **Logique** ;
  - **Sciences cognitives** : processus d'adaptation face à une situation ;
  - **Science des systèmes complexes** : systèmes dont on ne sait pas ce qui va sortir en fonction des paramètres d'entrée.
- **Machine learning (apprentissage automatique)** : « méthodes qui permettent à une machine d'**évoluer grâce à un processus d'apprentissage** ». La machine apprend grâce aux techniques ci-dessus. Cela n'a pas de sens de parler de ML sans ce qui le compose (méthodes statistiques, probabilités…).
- **Deep learning (réseaux de neurones)** : « méthode se basant sur de **grands réseaux de neurones artificiels comparables à ceux figurant dans le cerveau humain** permettant de faire du machine learning ».

### C. Neurone biologique / formel
- Le **neurone biologique** a une **excitabilité** et une **conductivité**. Il permet une **transmission du signal**.
- Le **neurone formel** reçoit des informations (**stimulus**) qui arrivent via des **« dendrites »**. Elles sont traitées par une **fonction d'activation (analogue à la synapse)**, et il transmet le stimulus par une **prise de décision (analogue à l'axone)**.
  - ⚠️ La diapositive photographiée place « Synapse » à l'arrivée des stimuli et « Fonction d'activation » à part. Le support fait **fonction d'activation ≈ synapse**. Il vaut mieux **ne pas construire d'item sur ces analogies** (ambigu).
- **McCulloch et Pitts, 2 mathématiciens**, ont conceptualisé le neurone mathématique en définissant le neurone formel. C'est ce système qui est **à l'origine du développement de toutes les méthodes développant l'IA**. **1943**.
- Une « tour de commande » analyse les stimuli grâce à une fonction d'activation, qui prend une **décision de forme binaire : « oui » ou « non »**. La décision dépend de l'information arrivée et de ce qui s'est passé au centre de commande.
- S = x·w (x = valeur numérique, w = poids = importance) ; n stimuli = paramètres d'entrée ; Σ(xᵢ·wᵢ) ; « fonction de transfert ».
- Les **stimulus n'ont pas tous le même poids** (pas la même importance) selon la décision à prendre. On multiplie chaque stimulus par son poids, on fait la somme, et on compare le résultat à un **seuil**.
- Exemple viande ou poisson : « cet individu va **tous les jours à la poissonnerie** » pèse **plus** que « cet individu a **les yeux bleus** ». La nature du stimulus peut modifier la réponse ; on ajuste **un poids variable à chaque information**.
- Comparaison au **seuil d'activation w₀** : Σ > w₀ → **neurone activé** (classe 1) ; Σ < w₀ → **non activé** (classe 2) → **deux groupes par classification binaire** (valeurs inférieures et valeurs supérieures au seuil).
- Le réseau compile un très grand nombre de neurones ; le processus se répète **des milliers de fois**.
- **Perceptron** = « le jeu du système apprenant » : être capable, selon les données d'entrée, d'**adapter les poids** pour que la décision finale corresponde à **une certaine vérité**. C'est l'**apprentissage dans les réseaux de neurones**, qui permet la **pondération des informations incidentes**.
- Schéma : entrée → 1re et 2e couches cachées → sortie = probabilités.

### D. Exemple simple d'apprentissage : intention de vote à l'élection présidentielle
- On donne à l'IA **6 personnes** interrogées (âge, revenus, CSP, sexe, vote) avec des **poids** (quelle caractéristique est la plus déterminante).
- Figure : poids 2 (âge = 35), 4 (**revenu = 70 000** ; ⚠️ la photo de la diapositive de cette année montre 100 000), 1 (CSP = 2), 1 (sexe = M) → 0,12 / **0,63 → Droite** / 0,25.
- **Plus on a de paramètres, plus il faut d'individus** pour un modèle fiable, donc plus de données.
- L'IA doit donner **la probabilité** qu'une personne vote de telle manière.
- Les décisions de l'IA dépendent **des données apportées en entrée** et **du poids donné aux différents paramètres** → l'IA construit des **décisions probabilistes**.
- « L'impact de l'apprentissage a donc un **impact majeur** sur les résultats finaux. »

### E. La supervision
- « Toutes les décisions prises par l'IA dépendent de la **manière dont on l'a fait apprendre** et du **poids** donné aux paramètres. »
- **Supervisé** : **jeu de données plus restreint**, la machine **connaît déjà les réponses** ; elle **détermine les caractéristiques des différentes classes** ; **nombre de classes fixé a priori** → **subjectivité du classifieur**. Si la personne qui a défini les classes s'est trompée → **biais** (ex. **radios de cancer du sein mal interprétées**).
  - Le système fait des calculs statistiques selon la configuration de l'image et repère les images similaires (ex. **avions : les ailes**) → donne une **probabilité statistique** que l'image soit un avion.
  - Ex. **Captcha** (cliquer sur les vélos sert à entraîner une IA) ; si l'humain se trompe → données faussées → **biais** (subjectivité du classifieur).
  - → **Cancer du sein, avions et Captcha = exemples d'apprentissage SUPERVISÉ.**
- **Non supervisé** : **jeu de données plus important**, la machine **ne connaît pas les réponses** ; elle détermine des **clusters (classes)** ; **nombre de classes non fixé** → **détection de nouvelles classes** ; la machine classe toute seule et détecte parfois des **classes aberrantes** (ex. elle range **dix images dans une classe à part sans raison définissable par l'humain**).

### F. 3 grands types d'IA
- **Descriptive** : analyse de données massives, identification de tendances, production de rapports, graphiques et tableaux de bord ; **recherche des signaux faibles**, repérables seulement avec beaucoup de données, qu'un humain ne pourrait pas détecter.
- **Prescriptive générative** : crée de nouvelles données, création d'images, rédaction de textes (ex. **ChatGPT**).
- **Prédictive** : utilisation de modèles, apprentissage automatique, prédiction d'événements ; **très utile en médecine pour savoir quel est le traitement le plus adapté à une situation précise ++++** (données sur les cancers, génomique, radiologie, traitements…).

## VI. Données : entrepôt
- Schéma « Histoire, **2013** » : DPI (comptes rendus, labo, PACS, DSI, PMSI, radio…) → entrepôt (requête structurée, requête plein texte, index, métadonnées, documents, ETL, EAI).
- Beaucoup de données issues de nombreux secteurs (laboratoires, imagerie, dossiers patients) : « autant de natures d'information, autant de bases de données **toutes hétérogènes** ». D'où les **entrepôts de données**, qui **réunissent toutes les informations concernant un patient en une fiche unique** ; ces bases peuvent ensuite être **interrogées**. « Actuellement toutes les données des CHU sont en train d'être **dupliquées** pour être organisées dans ces bases de données. »
- **Réseaux régionaux.** **HUGO** = **premier réseau européen** de big data en santé : **6 hôpitaux, 5,1 millions de patients, 1,3 milliard de données**.

## VII. Applications : CHU de Brest
### A. Les 12 solutions
- Imagerie et radiologie : **AVICENNA.AI** (détection d'hémorragies intracrâniennes), **INCEPTO** (BoneView et ChestView en radiologie), **PYLCLARI.AI** (interprétation d'examens TEP).
- Chirurgie et blocs : **HOPIA** (planification des vacations de bloc), **PRAEVAorta 2** (aide à la décision en chirurgie vasculaire).
- EHPAD et surveillance : **OSO AI** (détection audio des chutes et des situations de détresse).
- Dermatologie et suivi des plaies : **PIXACARE** (documentation et suivi des plaies).
- Solutions transversales : **Chat Team Mistral AI**, **Copilot 365 Microsoft**.
- Documentation et communication : **GED-I** (accès intelligent aux documents qualité, **RAG**), **LIFEN Documents** (correspondance dématérialisée Vigilan5).
- Orientation et navigation : **SWEEPIN** (géolocalisation et guidage intérieur).

### B. Typologie des technologies
| Catégorie | Rôle | Solutions |
|---|---|---|
| Analyse d'images médicales | détection automatique de pathologies sur imagerie | AVICENNA.AI, INCEPTO, **PIXACARE** |
| Traitement du langage (**NLP**) | extraction d'informations et **RAG documentaire** | GED-I, LIFEN |
| Planification et optimisation | algorithmes de planification intelligente | HOPIA |
| Analyse sonore | reconnaissance de sons et alertes automatisées | OSO AI |
| Géolocalisation et guidage | navigation intelligente et suivi en temps réel | SWEEPIN |
| Assistants IA génériques | assistants conversationnels et productivité | Mistral AI, Copilot 365 |

- Caractéristiques : **prédominance des technologies d'analyse d'images** ; **émergence des assistants IA génériques pour la productivité**.
- Exemples d'utilisation : **dépistage du cancer du sein** ; **EHPAD : détection audio des chutes et des situations de détresse (« oreille augmentée des soignants »)**.

### C. Analyse d'image : AVICENNA.AI
Priorisation automatique des cas critiques ; **réduction du temps d'interprétation de 60 %** ; amélioration de la détection des saignements subtils.

### D. Gestion des organisations : HOPIA (chirurgie et blocs)
**Production automatique de plannings** ; intègre les **contraintes (matériel, compétences, salles, indication, ressources RH)** ; **gain RH**.

### E. Analyse sonore automatisée : OSO AI (EHPAD)
**Détection proactive** des situations d'urgence ; **réduction du temps de réaction des soignants** ;
**respect de la vie privée (analyse sonore sans enregistrement)**. **15 % d'incapacité à utiliser les systèmes d'alerte.**

## Écarts entre le support et les notes / diapositives de cette année (à éviter dans les items ou à préciser)
| Point | Support tutorat | Notes / diapositive 2026-27 |
|---|---|---|
| 1er article IA | 1950 | diapo : 1951 ; note : 1950 |
| 2025 | 68 000/an | 68 000 sur 8 mois → ~100 000 |
| Revenu dans l'exemple | 70 000 | 100 000 |
| Fonction d'activation | analogue à la synapse | diapo : synapse = point d'entrée |
| HUGO | « big-bang data » (coquille) | big data |
| LIFEN | « LIGEN » (coquille) | LIFEN |
