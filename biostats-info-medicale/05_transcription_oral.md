# Transcription automatique du cours oral (Pr Stindel, 2026-2027) : ce qu'elle apporte

Source : dictée vocale très bruitée, collée par l'étudiant. Seuls les points **lisibles avec une confiance
raisonnable** sont retenus. Ce sont des **dires oraux**, à utiliser pour comprendre, pas comme formulation « texto cours ».

## Introduction / information
- On entend partout que l'IA est géniale. Le monde numérique est **beaucoup plus éphémère** : les disques disparaissent,
  « même si notre vie repose là-dessus » (lien avec la note « on ne sait plus lire certains supports alors qu'on lit des papyrus »).
- L'information est une notion **complètement immatérielle**, un concept théorique lié à la **transmission de message** ;
  elle permet de **percevoir l'environnement** ; elle est **mesurable quantitativement** (exemple Médor).

## Codage (expliqué à l'oral, alors que les notes disent « pas de questions au concours »)
- Le processeur est fait de petits circuits intégrés : le courant passe ou ne passe pas → **2 états**.
- **Analogie de la porte des toilettes** (ouvert / fermé = 1 / 0) pour fabriquer « un ordinateur chez vous ».
- **Anecdote du logo Apple** : la **pomme croquée** = jeu de mots « **bite / byte** » (byte = octet en anglais). Il aime les exemples.
- Octet = concaténation de 8 bits (2 × 2 × … = 256) ; 2 octets = **16 bits** → 2¹⁶ codes ; le nombre de codes dépend du nombre de bits.
- **Jeux vidéo des années 80** : la première génération (exemple **Batman**) avait **256 couleurs maximum** (8 bits). En passant à
  **2²⁴** couleurs, l'œil ne fait plus la différence → jeux « quasiment dans le monde réel », séquences vidéo.
- Conversion faite en classe : 2⁰ = 1 … 2⁷ = 128 ; exemple **10001001 = 128 + 8 + 1 = 137** (exemple du support).

## IA : historique
- **PubMed** = tous les articles médicaux publiés depuis toujours, des milliers par jour → **des millions d'enregistrements**.
- Premiers articles mentionnant l'IA vers **1950**. On trouve des **traces bien plus anciennes** (Pascal, mathématiciens du
  **XIXe siècle**, « années 1800 »), mais hors communauté médicale → explique la phrase du polycopié
  « cela avait débuté bien longtemps avant 1950 ».
- Jusqu'en **1980** : < 10 articles/an (« c'est pour ça que c'est une date importante ») ; **80-98** → **1 000/an** ; puis **10 000/an** ;
  **2025** : **68 000** juste avant la rentrée, « probablement 100 000 » sur l'année. Explosion **2016-2018**.
- Sondage en amphi : beaucoup savaient que « c'est vieux ».

## IA : définitions et composantes
- **Deux définitions** : celle du dictionnaire (Larousse : réaliser des machines capables de simuler certains traits de
  l'intelligence humaine) et celle de **Woody Allen** (« le contraire de la bêtise naturelle »).
- L'IA n'est pas une chose en soi : il n'y a pas « l'IA et le reste du monde » ; c'est une **construction, un assemblage de méthodes**.
- **Science des systèmes complexes** : modèles si complexes qu'on ne sait pas ce qui va sortir selon ce qu'on rentre.
- **Machine learning** = méthodes qui permettent de faire **apprendre** quelque chose à une machine (elle évolue par un processus
  d'apprentissage). « Ça n'a **pas de sens d'en parler tout seul** » : il est composé de nombreuses méthodes, **statistiques** et **probabilités**.
  (→ corrige la note manuscrite « ça n'a pas de sens d'évoluer tout seul », qui était une mauvaise transcription.)
- **Deep learning** : réseaux de neurones, abordé « sans y aller trop profondément » car « personne ne comprend ».

## Neurone formel
- Des informations **arrivent** au neurone, l'information **repart par l'axone**.
- McCulloch et Pitts ont conceptualisé la **version mécanique / électronique** : le neurone formel est « **le grain de sel à l'origine de tout ce qui va suivre** ».
- Exemple **viande ou poisson** détaillé : l'individu va **4 fois par semaine chez le poissonnier**, **2 fois chez le boucher** ; boit du vin, fume,
  a les yeux bleus… ; 10 individus à classer. On donne **plus d'importance à l'information la plus pertinente** (poissonnier) qu'à la couleur des yeux.
  Si la **somme pondérée dépasse le seuil d'activation**, la fonction s'active (« la lumière s'allume ») → poisson ; sinon le neurone reste **non activé** → **2 classes**.
- Dans un réseau, cela se passe **des milliers de fois, voire plus** (1re analyse, 2e, 3e…). Le jeu du **système apprenant (perceptron)** est
  d'**adapter les poids** pour que la décision finale corresponde à **une certaine vérité** = **apprentissage** ; avec des réserves sur ce qui se passe au milieu (**couches cachées**).

## Exemple des élections
- Individus : 25 000 €, masculin → a voté à gauche ; 60 ans, gagne plus, femme → droite ; etc.
- Le système « tourne » pendant toute la **phase d'apprentissage** pour régler les poids → associer une **probabilité de vote** à un individu
  donné selon le **poids** et la **valeur** des paramètres.
- L'IA = **fonctionnement probabiliste** ; décision probabiliste selon des **poids fixés pendant l'apprentissage** → impact **majeur** sur les résultats.
- **« Comment fait-on une IA raciste ? »** : des données d'apprentissage biaisées (exemple évoqué : données sur les personnes en prison) → **réflexion biaisée**.

## Supervision
- **Supervisé** (« la façon que je viens d'expliquer ») : données **relativement restreintes**, on a **toutes les réponses** ; images de **chien, chat,
  avion, bateau** ; la machine fait des **calculs statistiques sur la configuration de l'image** et les associe à la **vérité donnée** (une zone homogène
  en forme d'**aile** → x % de probabilité d'avion). **Classes connues et fixées à l'avance.**
  - **Inconvénient** : « si je prends un chat pour un avion, elle se trompe aussi ». **Captcha** (cliquer sur les **feux rouges**).
  - **Cancer du sein** : des **experts** étiquettent les images ; **s'ils se trompent, l'apprentissage sera mauvais** ; même les radiologues ne font pas 100 % de diagnostics parfaits.
- **Non supervisé** : la machine fait **seule** ses classes ; ensuite, face à un examen, elle donne une **probabilité** (cancer ou non) selon ses classes.
  **Limite** : elle crée parfois des **classes qui ne correspondent à rien** (« autre chose ») ; trop de « autre chose » → on ne peut pas s'appuyer dessus pour des **décisions thérapeutiques**.

## Catégories
- **Prédictive** = la **plus intéressante en médecine** : modèles pour **prévenir des événements**, « **super important pour notre métier** » ; exemple :
  type de cancer, génomique du patient → **réaction au traitement** ; tout dépend des paramètres et de leur pondération pendant l'apprentissage.
- **Descriptive** : analyse statistique de bases de données, **identification des tendances**, **signaux faibles** qu'on ne voit pas, visibles quand on **massifie** l'information.

## Données
- Tout part de l'**apprentissage**, de la **nature des données** et du **poids**.
- Données issues de **très nombreux secteurs** : imagerie, dossier patient, systèmes d'information, **PMSI et codage** (chaque pathologie est **codée**, notamment
  pour la **facturation**), radio… → autant de natures d'information. Rappel des **1,3 milliard de données** (HUGO).

## Applications
- **Imagerie** : applications « extrêmement variées » ; **dépistage automatique des fractures aux urgences**, implanté dans des milliers d'établissements.
- **Blocs** (organisation).
- **EHPAD** : « un truc très rigolo » → **analyse de signal (sonore) à distance** (OSO AI). La transcription s'arrête là.
