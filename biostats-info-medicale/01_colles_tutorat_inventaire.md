# Inventaire des colles de tutorat : biostats, colle n°5 (Tutorat Santé Brestois)

But : créer de nouveaux QCM d'**informatique médicale** (cours de M. Stindel) qui **ne ressemblent pas**
à ceux des colles précédentes. Ce fichier recense ce qui a déjà été posé, pour repérer les doublons.

Sources lues (corrections détaillées) :
| Année | Informatique médicale | Remarques |
|---|---|---|
| 2022-2023 | QCM 17 à 20 (4 QCM) | |
| 2023-2024 | QCM 17 à 20 (4 QCM) | en-tête « Colle n°4 », mais c'est la même colle |
| 2024-2025 | QCM 20 à 22 (3 QCM) | |
| 2025-2026 (version tuteurs) | **aucun** | seulement stats probabilistes (1-11) + recherche clinique (12-18) |

Structure fixe : 5 items A-E, **E = « Toutes les propositions précédentes sont fausses »**, consigne
« cochez la (les) proposition(s) exacte(s) ».

---

## 1. Items d'informatique médicale déjà posés (par thème)

### 1a. Information / données / théorie de l'information
- Information = notion **immatérielle**, existe en dehors d'un support physique (piège : « matérielle »). [22-23 Q17A, 23-24 Q19B, 24-25 Q20B (« l'informatique est une notion matérielle »)]
- « Concept lié à la transmission d'un message » (collé à la fausse « matérielle »). [22-23 Q17A]
- Données = **description élémentaire** d'une chose ou d'un événement, souvent **codée**. [22-23 Q17B]
- Piège : « l'information est ce qui est de nature à changer une décision » est attribué à la **théorie de la décision**, pas à la théorie de l'information. [22-23 Q17C]
- L'information est **mesurable** (théorie de l'information). [23-24 Q19C, 24-25 Q20C]
- La quantité d'information **n'est pas toujours proportionnelle** au contenu (exemple Médor chien / quadrupède). [22-23 Q17D, 23-24 Q19D]
- Le papier / un support = élément de **stockage** des données. [23-24 Q19A, 24-25 Q20D]
- Informatique = science du **traitement automatique de l'information** (information + automatique). [24-25 Q20A]

### 1b. Architecture de l'ordinateur
- Unité centrale / microprocesseur = circuit intégré dont le comportement est déterminé par un programme (série d'instructions) ; reçoit des informations, émet des ordres. [22-23 Q18A, 24-25 Q21A]
- RAM **labile**, mémoire temporaire, mémoire vive (Random Access Memory). [22-23 Q18B, 23-24 Q17A, 24-25 Q21B-C]
- ROM **non labile**, fixe, non réinscriptible (flashage). [23-24 Q17B, 24-25 Q21B]
- Entrées (clavier, souris, scanner) / sorties (écran, imprimante, haut-parleur) ; piège : écran classé en entrée, ou « les sorties apportent des informations ». [22-23 Q18C, 24-25 Q21D]
- Bus de données = lignes **parallèles** (piège : « perpendiculaires ») ; le nombre de lignes **donne** la taille de l'information. [22-23 Q18D, 23-24 Q17C]
- Le bus de données (DB) transporte les données inscrites en ROM et les données lues et écrites en RAM (piège : « lues et écrites en ROM »). [23-24 Q17D]

### 1c. Codage binaire
- Conversions binaire → décimal **déjà utilisées** (à ne pas réutiliser) :
  - 11000101 = 197 [22-23 Q20B]
  - 01111011 = 123, sur 1 byte [22-23 Q20C]
  - 10101010 = 170 (leurre : 85, son complément) [23-24 Q18]
  - 211 = 11010011 (leurre : 11001011) [23-24 Q20C]
  - 1001010 = 74 (leurre : 60), **nombre sur 7 bits** [24-25 Q22C-D]
- 16 bits → de 0 à 65 535. [22-23 Q20A]
- 1 Ko = 1024 octets = 8192 bits (piège : « 1024 motifs binaires »). [22-23 Q20D]
- 1 octet = 256 possibilités, **de 0 à 255** (piège : de 1 à 256). [23-24 Q20A]
- 1 octet = 1 byte = 8 bits (pièges : « 1 octet = 8 bytes », « codé sur 1 bit »). [23-24 Q18C-D, Q20B, 24-25 Q22B]
- Parité : un octet qui finit par 1 est impair. [23-24 Q20D]
- Bit = 2 valeurs distinctes (piège : 4) ; 0 = composant fermé, 1 = ouvert. [24-25 Q22A]
- Octet = ensemble ordonné de 8 éléments binaires traités comme un tout. [24-25 Q22B]

### 1d. Applications médicales
- SIH = système d'information **hospitalier** (piège : « hôtelier »). [22-23 Q19A]
- Interconnexion / partage via DPI et DMI ; 70 % des médecins exercent en libéral. [22-23 Q19B]
- Rôles : contexte économique, base de données sur l'état de santé des populations, recensement des nouvelles connaissances ; informatique au bloc opératoire. [22-23 Q19C]
- Medline = base de données bibliographique gratuite. [22-23 Q19D]

**Thèmes jamais (ou très peu) exploités** : codage d'autres types de données (caractères/ASCII, nombres
négatifs, réels, images, son…), conversion décimal → binaire faite à la main, hexadécimal, unités au-delà
du Ko, bus d'adresses / de commande, détail des périphériques de stockage, logiciel / système
d'exploitation / programmation, réseaux et Internet, bases de données, sécurité et confidentialité (CNIL,
RGPD, secret médical), classifications et terminologies (CIM, CCAM…), DMP, télémédecine, aide à la
décision. **À confirmer avec le cours** : ce sont des pistes seulement si elles sont au programme de
l'année en cours.

---

## 2. Moules de pièges récurrents (à éviter de recopier tels quels)
1. Inversion d'un adjectif : matériel/immatériel, labile/non labile, parallèle/perpendiculaire, entrée/sortie, hospitalier/hôtelier.
2. Mauvaise attribution : théorie de l'information ↔ théorie de la décision ; RAM ↔ ROM.
3. Erreurs d'unités : bit ↔ byte, octet = 8 bytes, 1 Ko = 1024 bits.
4. Bornes décalées de 1 : 1-256 au lieu de 0-255.
5. Conversion binaire avec un leurre (complément, bits inversés, valeur proche).
6. Question construite sur le même énoncé binaire (« Le nombre binaire X : A) = n1 B) = n2 C) 1 bit D) 1 byte »).

→ Pour qu'un QCM « ne ressemble pas », changer **le concept testé** ou **la forme** (mise en situation,
calcul inverse, raisonnement en plusieurs étapes, comparaison, intrus…), pas seulement les valeurs.

---

## 3. Erreurs repérées dans les corrections du tutorat (ne pas les reproduire)
- **23-24 Q20** : réponse donnée « A », mais l'item A (« 256 possibilités, allant de 1 à 256 ») est faux
  (c'est de 0 à 255, comme le dit la correction elle-même). B, C et D sont faux aussi, donc la bonne réponse est **E**
  (la correction écrit d'ailleurs « E) VRAI »).
- **24-25 Q20** : réponse donnée « AC », mais la correction de D dit « VRAI » (support = élément de stockage,
  cohérent avec 23-24 Q19A). La réponse cohérente est **ACD**.
- **24-25 Q22** : intitulé « À propos de l'*information* médicale » alors que le sujet est le codage.
- 22-23 Q17A : la correction ne commente que « matérielle » ; la seconde moitié (« transmission d'un
  message ») n'est pas tranchée. À vérifier dans le cours avant de réutiliser.

---

## 4. Rappel des autres parties de la colle (contexte)
- Stats probabilistes (M. Morin) : distributions d'échantillonnage, estimation, IC/IP, tests de conformité
  et d'homogénéité, Khi², régression/corrélation (moindres carrés/rectangles, Fisher argth), tests non
  paramétriques.
- Recherche clinique (M. Stindel) : screening, préclinique (in vitro / in silico / animal), phases 1 à 4,
  AMM, critères d'inclusion/exclusion, tirage au sort, clause d'ignorance, table de permutation, critères de
  jugement (objectif/subjectif, substitution), aveugle.

---

## 5. À compléter
- [x] Annales du professeur (5 dernières années) : voir `02_annales_prof_inventaire.md`.
  Valeurs binaires déjà utilisées à l'examen : 170, 106 (leurre 108), 13 (deux fois), 99, addition 13 + 17 = 30.
- [ ] Cours d'informatique médicale (versions successives) : ce qui a été ajouté ou retiré.
