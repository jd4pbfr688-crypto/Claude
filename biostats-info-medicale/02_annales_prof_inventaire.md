# Annales officielles (examens de décembre) : ce que pose le professeur

Sources : corrections du tutorat (non officielles) des examens de **déc. 2020, déc. 2021, déc. 2022,
déc. 2023, déc. 2024, déc. 2025**. Chaque examen compte 20 QCM.

## 1. Place de l'informatique médicale dans l'examen

| Examen | QCM d'informatique | Thèmes |
|---|---|---|
| Déc. 2020 | Q18, Q19 | octet (> 256 valeurs ?), 170 = 10101010, bit = 4 valeurs ?, Medline ; 01101010 = 106 (leurre : 108), 1 octet ou 1 bit |
| Déc. 2021 | **aucun** | (Q17 à Q20 : recherche clinique et échantillonnage) |
| Déc. 2022 | Q17, Q18 | bus de données ; octet |
| Déc. 2023 | Q19, Q20 | ROM ; binaire + Medline / MeSH |
| Déc. 2024 | Q19, Q20 | RAM ; binaire (dont **addition**) + info immatérielle |
| **Déc. 2025** | **Q19, Q20** | **deep learning ; entrepôts de données de santé** (IA, plus aucune architecture ni binaire) |

→ **0 à 2 QCM par an**, toujours en fin de sujet, juste après la recherche clinique. Soit environ 10 % de la note.

## 2. Tous les items d'informatique posés par le professeur

### Déc. 2020
- Q18 (QCM mixte, sans énoncé commun) :
  A) Il est possible de coder plus de 256 valeurs sur un octet. **F**
  B) L'entier 170 en décimal correspond au code binaire 10101010. **V**
  C) Un bit permet de coder 4 valeurs différentes. **F**
  D) Medline est une base de données de traitements. **F** (bibliographique)
- Q19 « Le nombre binaire 01101010 : » A) = 106 **V** B) = 108 **F** C) est codé sur 1 octet **V** D) sur 1 bit **F**

### Déc. 2022
- Q17 « Un bus de données » :
  A) transporte les données inscrites en ROM. **V**
  B) transporte les données uniquement lues en RAM. **F** (lues ET écrites)
  C) transporte les données entrantes ou sortantes. **V**
  D) impacte la performance globale du système. **V**
- Q18 « Un octet » :
  A) est un ensemble ordonné de 8 éléments binaires. **V**
  B) permet de coder 128 valeurs distinctes. **F**
  C) permet de coder 256 valeurs distinctes. **V**
  D) se traduit en anglais par le mot « bit ». **F** (byte)

### Déc. 2023
- Q19 « La ROM » :
  A) ROM = Read Only Memory. **V**
  B) mémoire non labile. **V**
  C) permet de stocker le programme de gestion du système. **V**
  D) peut être mise à jour par flashage. **V** → réponse ABCD
- Q20 (mixte) :
  A) l'octet 00001101 = 13. **V**
  B) 01100011 = 99. **V**
  C) Medline = base de données documentaire mise à disposition par la National Library of Medicine. **V**
  D) Medline est indexée à l'aide d'un thésaurus appelé MeSH. **V** → réponse ABCD

### Déc. 2024
- Q19 « La RAM » (**même moule que la ROM de 2023, items en miroir**) :
  A) RAM = Random Access Memory. **V**
  B) mémoire labile. **V**
  C) permet de stocker le programme de gestion du système. **F** (c'est la ROM)
  D) peut être mise à jour par flashage. **F** (c'est la ROM)
- Q20 (mixte) :
  A) l'octet 00001101 = 13. **V** (**même item mot pour mot qu'en 2023**)
  B) 00001101 + 00010001 = 30 (13 + 17). **V**
  C) un octet est constitué de 8 bytes. **F**
  D) la notion d'information est une notion immatérielle. **V**

### Déc. 2025 (le plus récent : **le nouveau programme IA est déjà tombé**)
- Q17-Q18 = recherche clinique (programme de développement, avantages du in silico). La consigne passe à « exacte(s) » pour Q17-20.
- Q19 « À propos du « deep learning » » :
  A) méthode basée sur des réseaux de neurones artificiels. **V**
  B) la notion de neurone artificiel est récente, moins de 10 ans. **F** (McCulloch-Pitts 1943)
  C) fait partie des méthodes d'apprentissage automatique. **V**
  D) fréquemment utilisé pour reconnaître des organes dans des images médicales. **V**
  → réponse **ACD**
- Q20 « Les entrepôts de données de santé : » :
  A) sont des clones des systèmes d'information hospitaliers. **contesté**
  B) constituent des bases de données massives permettant d'entraîner des réseaux de neurones. **contesté**
  C) permettent la réalisation d'études cliniques sur des données de vie réelle. **V**
  D) contiennent des données du soin courant. **V**
  → le tutorat hésite entre **ACD** et **BCD**. Le tutorat cite une phrase du cours de l'an dernier : « les données des CHU sont
  en train d'être **dupliquées** pour être organisées dans ces bases ». Mon avis : **BCD** est plus défendable.
  Un entrepôt agrège bien plus que le SIH (labo, PACS, PMSI, radio, comptes rendus : diapositive « 2013 »), donc ce n'est pas un « clone »,
  et HUGO / big data sert bien à entraîner les modèles.
- Recyclage confirmé : en déc. 2025, Q14 (variable réduite), Q15 (sensibilité) et Q16 (graphe des centiles) sont **identiques mot pour mot** à déc. 2020.

## 3. Le style du professeur

- **Consigne** : « Vous noircirez la (les) proposition(s) exacte(s) / correcte(s) ».
- **E** = « Aucune des précédentes propositions n'est exacte » (le tutorat écrit « Toutes les
  propositions précédentes sont fausses »).
- **Énoncé = un sujet nominal court** (« Un octet », « La ROM », « La RAM », « Un bus de données »), et
  chaque item **complète la phrase** (« transporte… », « permet de coder… »). Sinon, **QCM mixte** sans
  énoncé commun : 2 items de calcul binaire + 2 items de cours.
- **Items courts, une seule idée par item**, presque toujours **« texto cours »**. Un item faux se fabrique en
  remplaçant **un mot** :
  - une valeur numérique (128/256, 4 valeurs pour un bit, 106/108) ;
  - un terme jumeau (bit/byte, RAM/ROM, labile/non labile) ;
  - un **adverbe restrictif** (« **uniquement** lues en RAM ») ;
  - une catégorie (base de données « de traitements » au lieu de « bibliographique »).
- **Pas de mise en situation clinique** en informatique (alors que la partie stats en a : patch-clamp,
  pédiatre, drépanocytose…).
- **Grilles « tout vrai » fréquentes** (ABCD en 2023, deux fois). Le professeur n'hésite pas à mettre 4 items vrais.
- **Calcul binaire en 2023 et 2024, mais plus en 2025** (et le cours actuel annonce « pas de questions sur le codage binaire »). Avant 2025, toujours en **binaire → décimal** sur un octet à petites valeurs
  (13, 99, 106, 170). Nouveauté 2024 : **une addition** (deux conversions, puis la somme en décimal).
- **Recyclage massif** : des QCM entiers reviennent mot pour mot d'une année sur l'autre (en stats : Bayes,
  Poisson, tableau de contingence, variable réduite… ; en informatique : 00001101 = 13 deux ans de suite,
  ROM puis RAM avec la même grille d'items).

## 4. Ce que le professeur a posé et que les colles n'ont jamais (ou peu) traité
- Bus de données : impact sur la **performance globale** du système, données **entrantes/sortantes**.
- ROM : stocke le **programme de gestion du système**, mise à jour par **flashage**, acronyme Read Only Memory.
- RAM : acronyme Random Access Memory, et elle **ne** stocke **pas** le programme de gestion du système.
- Medline : **National Library of Medicine**, thésaurus **MeSH** (les colles n'ont posé que « base bibliographique gratuite »).
- Octet = **128 ou 256** valeurs distinctes.
- **Addition binaire.**

## 5. Thèmes du cours d'informatique jamais posés à l'examen (déc. 2020 à déc. 2024)
D'après les colles (qui suivent le cours) : théorie de l'information / données (sauf l'item
« immatérielle » de 2024), unité centrale, connexions entrée/sortie, 16 bits / 65 535, Ko = 1024 octets,
parité, SIH / DPI / DMI, rôles de l'informatique en santé. **À vérifier avec le cours actuel.**

## 6. Remarques sur les corrections du tutorat (annales)
- Déc. 2021 Q19 : C est noté FAUX alors que la justification (« il y a une sélection… on ne peut pas
  comparer ») le rend VRAI. La même question en déc. 2020 donne BCD. Réponse cohérente : **BCD**.
- Déc. 2022 Q17 : les justifications de C et D ne correspondent pas aux items (C justifié par la taille de
  l'information, D par le transfert d'information). La réponse ACD reste plausible.
- Déc. 2023 Q14 D et Déc. 2024 Q3/Q10 : le tutorat lui-même signale une incertitude (« ? »).
- Déc. 2024 Q17 C (« une balance précise donne toujours une mesure juste ») est noté VRAI : discutable
  (précision ≠ justesse). C'est hors informatique, mais je le signale.
- Déc. 2024 : apparition de QCM de **métrologie / unités SI** (MKSA, ampère, patch-clamp) → **le cours a
  évolué**. À croiser avec les versions du cours.

## 7. Ce qui est déjà posé sur l'IA, à NE PAS reproduire dans des QCM « originaux »
- Deep learning = réseaux de neurones artificiels ; deep learning ⊂ apprentissage automatique ; reconnaissance
  d'organes dans les images médicales ; neurone artificiel « récent, moins de 10 ans » (piège de date, réponse 1943).
- Entrepôts de données de santé : clones du SIH ? données massives pour entraîner des réseaux de neurones ;
  études cliniques sur données de vie réelle ; données du soin courant.
- La même forme reviendra probablement : énoncé « À propos du … » / « Les … : », 4 items courts, un piège par
  adverbe ou par chiffre (« récente », « moins de 10 ans »).
