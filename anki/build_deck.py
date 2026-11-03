"""Génère le paquet Anki du chapitre « Cytopénies, hypercytoses, syndrome tumoral ».

Usage : python3 build_deck.py  →  écrit le .apkg et le .csv à côté de ce script.
"""
import csv
import pathlib

import genanki

ROOT = "Hémato::3 Cytopénies-Hypercytoses-Sd tumoral"
OUT = pathlib.Path(__file__).parent

# (sous-paquet, recto, verso)
CARDS = [
    # ------------------------------------------------------------------ #
    # 1. SÉMIOLOGIE LEUCO-PLAQUETTAIRE
    # ------------------------------------------------------------------ #
    ("1 Leuco-plaquettaire",
     "Valeurs normales des leucocytes (GB) et des PNN chez l'adulte ?",
     "GB : <b>4 à 10 G/L</b><br>PNN : <b>1,7 à 7,5 G/L</b>"),
    ("1 Leuco-plaquettaire",
     "Définition de la polynucléose neutrophile ?",
     "PNN <b>&gt; 7,5 G/L</b>"),
    ("1 Leuco-plaquettaire",
     "Quelles sont les conséquences cliniques d'une hyperleucocytose à PNN « en soi » ?",
     "<b>Aucune.</b> La vraie question est son <b>étiologie</b>."),
    ("1 Leuco-plaquettaire",
     "Face à une hypercytose, quelles sont les 3 questions à se poser ?",
     "1. <b>Physiologique</b> (variante de la normale) ?<br>"
     "2. <b>Réactionnelle</b> (processus général, non hématologique) ?<br>"
     "3. <b>Hémopathie</b> ? (plus grave, mais beaucoup plus rare)"),
    ("1 Leuco-plaquettaire",
     "Filiation des PNN et cytokines principales (de la plus précoce à la plus tardive) ?",
     "CFU-GEMM → CFU-GM → CFU-G → précurseurs granuleux → PNN<br>"
     "Cytokines : <b>SCF → GM-CSF → G-CSF</b>"),
    ("1 Leuco-plaquettaire",
     "Quels sont les mécanismes d'action anti-infectieuse du PNN ?",
     "Enzymes des granules, <b>phagocytose</b>, <b>burst oxydatif</b> (dérivés réactifs de l'O₂), "
     "libération de <b>NET</b> (pièges à bactéries faits d'ADN).<br>"
     "Il y arrive par chimiotactisme puis diapédèse."),
    ("1 Leuco-plaquettaire",
     "Polynucléose neutrophile par stimulation <u>appropriée</u> de la granulopoïèse : causes ?",
     "• <b>Infections</b> aiguës (myélémie possible &lt; 15 %, monocytose) ou latentes : bactérienne &gt; fongique &gt; virale<br>"
     "• Syndromes <b>inflammatoires</b> chroniques (maladies systémiques, cancers)<br>"
     "• <b>Nécroses tissulaires</b> : IDM, pancréatite aiguë, tumeurs malignes<br>"
     "• <b>Rebond</b> après agranulocytose<br>"
     "• Médicaments : facteurs de croissance hématopoïétiques"),
    ("1 Leuco-plaquettaire",
     "Polynucléose neutrophile par stimulation <u>inappropriée</u> : causes ?",
     "• Médicament : <b>lithium</b><br>"
     "• Hypercytokinémie <b>paranéoplasique</b> : cancer bronchique, Hodgkin<br>"
     "• Désordres <b>endocriniens</b> : hyperthyroïdie, (hypercorticisme)"),
    ("1 Leuco-plaquettaire",
     "Polynucléose neutrophile par <u>démargination</u> : causes ?",
     "• <b>Adrénaline</b> : stress, réanimation, adrénomimétiques<br>"
     "• <b>Exercice</b> / stress musculaire intense : traumatisme, convulsions, chocs électriques<br>"
     "• <b>Tabac</b> (&gt; 15 cigarettes/j ; disparaît <b>3 à 6 semaines</b> après l'arrêt)<br>"
     "• <b>Corticoïdes</b>"),
    ("1 Leuco-plaquettaire",
     "Variations physiologiques de la polynucléose neutrophile ?",
     "• <b>Âge</b> : nouveau-né (prématuré, hypotrophe ++) ; PNN 6 à 26 G/L à la naissance<br>"
     "• <b>Grossesse</b> : jusqu'à ×2 dès le 2ᵉ trimestre, jusqu'à <b>25 G/L</b> pendant le travail<br>"
     "• Cycle menstruel"),
    ("1 Leuco-plaquettaire",
     "Polynucléose neutrophile : arguments pour une cause <b>primitive</b> (hémopathie) ?",
     "• <b>Pas de point d'appel</b> infectieux/inflammatoire<br>"
     "• <b>Syndrome tumoral</b><br>"
     "• <b>Autres anomalies de l'hémogramme</b> : anémie, thrombopénie, blastose, cellules anormales"),
    ("1 Leuco-plaquettaire",
     "Définition de la myélémie ? (du plus mature au plus immature)",
     "Présence de <b>précurseurs granuleux</b> dans le sang : "
     "<b>métamyélocytes, myélocytes, promyélocytes</b>"),
    ("1 Leuco-plaquettaire",
     "Qu'est-ce qu'une myélémie <b>équilibrée</b> ?",
     "Elle respecte les proportions de la moelle :<br>"
     "<b>métamyélocytes &gt; myélocytes &gt; promyélocytes</b><br>"
     "→ plutôt réactionnelle"),
    ("1 Leuco-plaquettaire",
     "Quand une myélémie peut-elle être physiologique ?",
     "Si <b>modeste (&lt; 2 %)</b>, <b>équilibrée</b>, <b>transitoire</b> (vérifier qu'elle disparaît en quelques semaines). "
     "Aussi pendant la <b>grossesse</b>."),
    ("1 Leuco-plaquettaire",
     "Myélémie + érythroblastes + dacryocytes dans le sang : que faut-il évoquer ?",
     "Un <b>envahissement médullaire</b> et/ou une <b>fibrose de la moelle</b> "
     "(érythromyélémie)"),
    ("1 Leuco-plaquettaire",
     "Myélémie ou blastose : différence et valeur ?",
     "• Myélémie = les « <b>-cytes</b> » passent dans le sang ; peut être réactionnelle<br>"
     "• Blastose = des <b>blastes</b> dans le sang ; <b>jamais réactionnelle</b><br>"
     "Les myélémies les plus importantes : <b>SMP, surtout la LMC</b> (souvent déséquilibrées)"),
    ("1 Leuco-plaquettaire",
     "Seuils de la neutropénie et de l'agranulocytose ?",
     "Neutropénie : PNN <b>&lt; 1,5 G/L</b><br>Agranulocytose : PNN <b>&lt; 0,5 G/L</b><br>"
     "<i>(la restitution indique &lt; 1,7 G/L pour la neutropénie)</i>"),
    ("1 Leuco-plaquettaire",
     "Degrés de neutropénie et risque infectieux (PNN en /mm³) ?",
     "• 1 700 à 1 000 : <b>modérée</b>, risque ≈ nul<br>"
     "• &lt; 1 000 : <b>profonde</b>, risque modéré<br>"
     "• &lt; 500 : <b>très profonde</b>, risque majeur<br>"
     "• &lt; 200 : <b>agranulocytose</b>, risque majeur"),
    ("1 Leuco-plaquettaire",
     "Neutropénie : se définit-elle en pourcentage de PNN ?",
     "<b>Non</b> : on n'utilise que les <b>valeurs absolues</b> (G/L)."),
    ("1 Leuco-plaquettaire",
     "Caractéristiques des infections chez le neutropénique ?",
     "• Localisations <b>ubiquitaires</b>, particulièrement graves au <b>poumon</b><br>"
     "• La <b>fièvre</b> peut être le seul signe d'une septicémie → hémocultures répétées (aéro + anaérobie)<br>"
     "• Germes : <b>BGN</b> (choc septique), staphylocoques, <b>Candida, Aspergillus</b><br>"
     "• <b>Inflammation locale discrète, pas de suppuration</b>, mais dégâts tissulaires (angine ulcéro-nécrotique)<br>"
     "→ foyers difficiles à trouver"),
    ("1 Leuco-plaquettaire",
     "Première cause de mortalité du patient neutropénique ?",
     "Les <b>infections</b>"),
    ("1 Leuco-plaquettaire",
     "Quand suspecter une neutropénie ?",
     "• Devant tout épisode infectieux <b>sévère</b><br>"
     "• Devant un épisode infectieux <b>banal</b> (angine, aphtes) qui <b>ne répond pas</b> à un traitement adapté"),
    ("1 Leuco-plaquettaire",
     "Neutropénie fébrile : prise en charge initiale ?",
     "Dans les <b>heures</b> qui suivent la fièvre :<br>"
     "• <b>Isolement</b>, asepsie<br>"
     "• <b>Prélèvements</b> bactériologiques<br>"
     "• Prophylaxie des portes d'entrée<br>"
     "• <b>Antibiothérapie bactéricide à large spectre, empirique</b>, sans attendre les résultats"),
    ("1 Leuco-plaquettaire",
     "Une petite neutropénie impose-t-elle toujours une hospitalisation urgente ?",
     "<b>Non.</b> Neutropénie modérée sans signe infectieux = pas urgent.<br>"
     "Urgent si <b>neutropénie fébrile</b> ou <b>agranulocytose</b> (ex. patient sous chimio)."),
    ("1 Leuco-plaquettaire",
     "Neutropénie par excès de margination : profil et comment la confirmer ?",
     "Très fréquente, <b>modérée</b>, <b>sujet jeune</b>, sans infection.<br>"
     "Refaire la NFS <b>après un repas</b>, <b>après effort</b> (test de l'escalier), "
     "exceptionnellement après corticoïdes → démargination."),
    ("1 Leuco-plaquettaire",
     "Variation ethnique des PNN ?",
     "Valeurs physiologiquement <b>un peu plus basses</b> chez les personnes d'<b>origine africaine</b>."),
    ("1 Leuco-plaquettaire",
     "Neutropénie par excès de destruction périphérique : causes ?",
     "• <b>Hypersplénisme</b> (splénomégalie)<br>"
     "• Destruction par <b>anticorps</b> ou lymphocytes cytotoxiques (maladies auto-immunes)"),
    ("1 Leuco-plaquettaire",
     "Neutropénie par défaut de production médullaire : causes ?",
     "• <b>Infections</b> : virales +++, bactéries intracellulaires (rares, graves), parasites (leishmaniose, palu)<br>"
     "• <b>Médicaments</b><br>"
     "• <b>Envahissement / fibrose</b> médullaire (→ myélogramme / BOM)<br>"
     "• Maladie de la granulopoïèse : constitutionnelle (mutation du R-G-CSF, élastase) ou acquise "
     "(carences, myélodysplasies, leucémies)"),
    ("1 Leuco-plaquettaire",
     "Première cause à évoquer devant une agranulocytose ? Comment fait-on le diagnostic ?",
     "Les <b>médicaments</b> (toxicité dose-dépendante ou mécanisme immuno-allergique).<br>"
     "Diagnostic par l'<b>interrogatoire</b> (nouveau médicament ; ex. amidopyrine, sulfamides, pénicillines).<br>"
     "→ Pharmacovigilance ; ne jamais reprendre la famille si immuno-allergique."),
    ("1 Leuco-plaquettaire",
     "Éosinophiles / basophiles : cytokine clé et cellule qui la produit ?",
     "<b>IL-5</b>, produite par les lymphocytes <b>Th2</b> (IL-4, IL-5, IL-13)"),
    ("1 Leuco-plaquettaire",
     "Seuil de l'hyperéosinophilie ?",
     "PNE <b>&gt; 0,5 G/L</b>"),
    ("1 Leuco-plaquettaire",
     "Causes d'hyperéosinophilie ?",
     "<b>Réactionnelles</b> (réponse Th2) : <b>allergies</b>, <b>parasitoses (helminthiases)</b>, "
     "affections malignes et maladies de système<br>"
     "<b>Hémopathies</b> (rares) : réactionnelles (lymphomes, clone T) ou maladie myéloïde de la lignée (SMP)"),
    ("1 Leuco-plaquettaire",
     "Conséquences de l'accumulation d'éosinophiles et de la dégranulation des basophiles ?",
     "• Éosinophiles : <b>dégâts tissulaires</b> à long terme (enzymes des granules), notamment <b>cardiaques</b><br>"
     "• Basophiles : libération d'<b>histamine</b> → prurit, effets vasculaires, signes digestifs, bronchoconstriction"),
    ("1 Leuco-plaquettaire",
     "Seuils de la monocytose et de la monocytopénie ?",
     "Monocytose : <b>&gt; 1 G/L</b><br>Monocytopénie : <b>&lt; 0,2 G/L</b>"),
    ("1 Leuco-plaquettaire",
     "Causes réactionnelles d'une monocytose isolée ?",
     "• <b>Infections chroniques</b> : tuberculose, Osler, brucellose, salmonellose ; palu, leishmanie ; virus<br>"
     "• <b>Neutropénies</b> (phase de régénération) aiguës ou chroniques<br>"
     "• Syndromes <b>inflammatoires</b> : cirrhose, sarcoïdose, iléite, collagénoses, cancers<br>"
     "(sinon souvent satellite d'une polynucléose)"),
    ("1 Leuco-plaquettaire",
     "Monocytose d'origine hémopathique : 2 mécanismes ?",
     "• <b>D'accompagnement</b> : envahissement médullaire (Hodgkin, myélome), myélofibrose, carcinome métastatique<br>"
     "• <b>Clonale</b> : leucémies myélomonocytaires aiguës ou chroniques"),
    ("1 Leuco-plaquettaire",
     "Hyperlymphocytose : seuil et causes selon l'âge ?",
     "Lymphocytes <b>&gt; 4 G/L</b><br>"
     "• Enfant : <b>infection virale</b><br>"
     "• Adulte âgé : plutôt <b>hémopathie lymphoïde</b>, typiquement la <b>LLC</b>"),
    ("1 Leuco-plaquettaire",
     "Valeurs normales des plaquettes ? Seuils de la thrombopénie et de la thrombocytose ?",
     "Normale : <b>150 à 400 G/L</b><br>Thrombopénie : <b>&lt; 150 G/L</b><br>Thrombocytose : <b>&gt; 400 G/L</b>"),
    ("1 Leuco-plaquettaire",
     "Sémiologie d'une thrombopénie ?",
     "Syndrome hémorragique <b>cutanéo-muqueux</b> (hémostase primaire) :<br>"
     "• <b>Purpura</b> : pétéchies, ecchymoses<br>"
     "• Épistaxis, gingivorragies, méno-métrorragies, hématomes"),
    ("1 Leuco-plaquettaire",
     "Caractère essentiel du purpura ?",
     "Extravasation de sang dans le derme/hypoderme qui <b>ne s'efface pas à la vitropression</b> "
     "(ni à l'étirement de la peau). C'est un diagnostic clinique."),
    ("1 Leuco-plaquettaire",
     "Signes de gravité d'une thrombopénie ?",
     "• <b>Purpura extensif</b><br>"
     "• <b>Bulles hémorragiques</b> (bouche)<br>"
     "• Localisations ORL, <b>signes neurologiques</b><br>"
     "• <b>Hémorragies au fond d'œil</b> (risque d'hémorragie cérébrale) → urgences"),
    ("1 Leuco-plaquettaire",
     "Causes de thrombopénie ?",
     "• <b>Médicaments</b> (ex. héparine)<br>"
     "• <b>Infections</b> : hépatites, CMV, bactéries, palu<br>"
     "• <b>Auto-immune</b> (PTI), consommation (activation de la coagulation)<br>"
     "• <b>Hypersplénisme</b><br>"
     "• Défaut de production médullaire"),
    ("1 Leuco-plaquettaire",
     "Thrombopénie isolée : comment distinguer centrale et périphérique ?",
     "Pas d'équivalent des réticulocytes → <b>myélogramme</b> :<br>"
     "• Mégacaryocytes <b>nombreux</b> et normaux → <b>périphérique</b> (le plus souvent auto-immune : PTI)<br>"
     "• Mégacaryocytes <b>absents</b> → <b>centrale</b>"),
    ("1 Leuco-plaquettaire",
     "Piège : quelle thrombopénie est centrale malgré des mégacaryocytes nombreux ?",
     "Celle des <b>myélodysplasies</b> : la dysplasie entraîne l'<b>apoptose</b> des cellules en cours de différenciation."),
    ("1 Leuco-plaquettaire",
     "Thrombocytose : risques ?",
     "• Surtout <b>thrombose</b><br>"
     "• Paradoxalement, risque <b>hémorragique</b> si très grande (<b>&gt; 1 500 G/L</b>) : "
     "les multimères de Willebrand sont clivés<br>"
     "• Érythromélalgie (brûlures des extrémités)"),
    ("1 Leuco-plaquettaire",
     "Causes de thrombocytose ?",
     "<b>Réactionnelles</b> (les plus fréquentes) :<br>"
     "• <b>Inflammation</b> +++ (CRP, fibrinogène)<br>"
     "• <b>Carence martiale</b> (ferritine)<br>"
     "• <b>Asplénie</b> (moins de destruction)<br>"
     "<b>Primitive</b> : SMP, surtout <b>thrombocytémie essentielle</b>"),
    ("1 Leuco-plaquettaire",
     "Un hypersplénisme peut-il donner une thrombocytose ?",
     "<b>Non</b>, il donne une <b>thrombopénie</b> (la rate détruit les plaquettes). "
     "C'est l'<b>asplénie</b> qui donne une thrombocytose."),
    ("1 Leuco-plaquettaire",
     "Syndrome anémique + syndrome hémorragique + syndrome infectieux = ?",
     "<b>Syndrome d'insuffisance médullaire</b><br>"
     "(son équivalent biologique est la <b>pancytopénie</b>)"),
    ("1 Leuco-plaquettaire",
     "Bicytopénie et pancytopénie : définitions ?",
     "Baisse de <b>2</b> (bicytopénie) ou des <b>3</b> (pancytopénie) lignées myéloïdes : "
     "hémoglobine, plaquettes, PNN"),
    ("1 Leuco-plaquettaire",
     "Pancytopénie et aplasie : différence ?",
     "• Pancytopénie = baisse des 3 lignées <b>dans le sang</b><br>"
     "• Aplasie = <b>absence de tissu hématopoïétique dans la moelle</b> "
     "(provoquée par une chimio, ou spontanée)"),
    ("1 Leuco-plaquettaire",
     "Bi/pancytopénie : le plus souvent centrale ou périphérique ?",
     "Le plus souvent <b>centrale</b> (moelle) → les <b>réticulocytes</b> le confirment, puis exploration médullaire.<br>"
     "Rares causes périphériques : <b>hypersplénisme</b>, <b>hémorragie massive</b>, certaines situations auto-immunes."),

    # ------------------------------------------------------------------ #
    # 2. SYNDROME TUMORAL
    # ------------------------------------------------------------------ #
    ("2 Syndrome tumoral",
     "Définition du syndrome tumoral ?",
     "Ensemble des signes cliniques liés à l'<b>envahissement de tissus/organes</b> par les cellules "
     "hyperproliférantes d'une hémopathie → <b>augmentation de volume</b> et/ou retentissement fonctionnel.<br>"
     "(« tout ce qui fait des boules »)"),
    ("2 Syndrome tumoral",
     "Définition de l'adénopathie et seuil pratique ?",
     "<b>Hypertrophie pathologique d'un ganglion lymphatique</b><br>"
     "En pratique ≥ <b>1 cm</b> environ (seuil plus bas au coude, plus haut à l'aine)"),
    ("2 Syndrome tumoral",
     "Les 4 mécanismes d'une adénopathie ?",
     "1. Prolifération lymphocytaire <b>réactionnelle</b>, locale ou générale<br>"
     "2. Prolifération <b>tumorale primitive</b> du tissu lymphoïde (lymphome, LLC)<br>"
     "3. Accumulation de <b>granulocytes et d'histiocytes</b> (pus, granulomes)<br>"
     "4. Accumulation de cellules filtrées : <b>métastase ganglionnaire</b>"),
    ("2 Syndrome tumoral",
     "Citer les fausses adénopathies",
     "Anévrisme carotidien, digitations du SCM, glandes salivaires, kyste branchial, "
     "kyste du tractus thyréoglosse, neurofibrome, côte cervicale, abcès froid, lipome, "
     "hidrosadénite, hernie inguinale ou crurale"),
    ("2 Syndrome tumoral",
     "Masse cervicale <b>battante</b>, expansive ?",
     "<b>Anévrisme carotidien</b> → ne jamais ponctionner une masse battante"),
    ("2 Syndrome tumoral",
     "Masse cervicale <b>médiane</b> qui <b>monte à la déglutition</b> ?",
     "<b>Kyste du tractus thyréoglosse</b> (attaché à l'os hyoïde)"),
    ("2 Syndrome tumoral",
     "Masse cervicale latérale, bord antérieur du SCM, sujet jeune, liquidienne ?",
     "<b>Kyste branchial</b>"),
    ("2 Syndrome tumoral",
     "Masse molle, <b>fluctuante</b>, non inflammatoire (cou) ?",
     "<b>Abcès froid</b> (tuberculeux)"),
    ("2 Syndrome tumoral",
     "Masse sus-claviculaire dure comme de l'os, fixée ?",
     "<b>Côte cervicale</b> (le diagnostic se fait à la radio)"),
    ("2 Syndrome tumoral",
     "Masse inguinale <b>impulsive à la toux</b> ?",
     "<b>Hernie</b> inguinale ou crurale"),
    ("2 Syndrome tumoral",
     "Ganglion de Troisier : où et que fait-il rechercher ?",
     "<b>Sus-claviculaire gauche</b>. Il draine le territoire <b>sous-diaphragmatique</b> "
     "(abouchement du canal thoracique)<br>"
     "→ chercher un <b>cancer abdominal</b> : estomac +++, pancréas, côlon, rein, testicule"),
    ("2 Syndrome tumoral",
     "Cancer du testicule : où chercher les métastases ganglionnaires ?",
     "<b>Lombo-aortiques</b> (voire sus-claviculaire gauche), <b>et non inguinales</b>, "
     "bien que le périnée et les organes génitaux soient drainés par les ganglions inguinaux"),
    ("2 Syndrome tumoral",
     "Adénopathie : questions à l'interrogatoire ?",
     "<b>Date de découverte</b>, voyages, contage infectieux, profession, animaux, médicaments, "
     "signes loco-régionaux (ORL, stomato, digestifs), <b>état général</b> (poids, T°, sueurs, prurit)"),
    ("2 Syndrome tumoral",
     "Adénopathie : caractéristiques à décrire à l'examen ?",
     "Siège, taille, répartition (isolée ou poly-ADP), symétrie, consistance, aspect, sensibilité, mobilité<br>"
     "+ <b>schéma daté</b> avec les mesures"),
    ("2 Syndrome tumoral",
     "Adénopathie rouge, chaude, douloureuse, parfois fluctuante ?",
     "Étiologie <b>infectieuse</b> (et non une métastase)"),
    ("2 Syndrome tumoral",
     "Adénopathie dure, fixée, ligneuse, irrégulière ?",
     "<b>Métastase ganglionnaire</b>"),
    ("2 Syndrome tumoral",
     "Adénopathie indolore, ferme, régulière, élastique, mobile, persistante ?",
     "Plutôt une <b>hémopathie</b> (lymphome…)"),
    ("2 Syndrome tumoral",
     "Adénopathie localisée ou polyadénopathies : orientation ?",
     "• Localisée : maladie localisée → examiner le <b>territoire de drainage</b> (porte d'entrée infectieuse ou néoplasie)<br>"
     "• Polyadénopathies : maladie <b>généralisée</b>, bénigne (infection) ou maligne (leucémie, lymphome)"),
    ("2 Syndrome tumoral",
     "Que faire systématiquement quand on découvre une adénopathie ?",
     "Palper <b>toutes les aires ganglionnaires</b>, rechercher une <b>hépato-splénomégalie</b>, "
     "faire un <b>examen ORL</b> (amygdales)"),
    ("2 Syndrome tumoral",
     "Indication d'une biopsie-exérèse ganglionnaire ?",
     "Adénopathie <b>&gt; 1 cm</b>, <b>durable (&gt; 1 mois)</b> et qui ne fait pas la preuve de son étiologie"),
    ("2 Syndrome tumoral",
     "Adénopathies médiastinales : signes cliniques possibles ?",
     "• Paralysie du <b>récurrent gauche</b> (dysphonie)<br>"
     "• Respiratoires : toux sèche, dyspnée<br>"
     "• <b>Syndrome cave supérieur</b> : turgescence jugulaire, <b>œdème en pèlerine</b> (cou, face, bras), cyanose"),
    ("2 Syndrome tumoral",
     "Adénopathies médiastinales : signes radiologiques ?",
     "Radio de face : élargissement du médiastin « <b>en cheminée</b> »<br>"
     "Profil : comblement de la <b>clarté rétrosternale</b><br>"
     "Précisées par la TDM/IRM"),
    ("2 Syndrome tumoral",
     "Turgescence jugulaire spontanée ou reflux hépato-jugulaire : que évoque chacun ?",
     "• Reflux hépato-jugulaire (en appuyant sur le foie) : <b>insuffisance cardiaque droite</b><br>"
     "• Turgescence <b>spontanée</b> : compression de la <b>veine cave supérieure</b> (syndrome tumoral possible)"),
    ("2 Syndrome tumoral",
     "Adénopathies abdomino-pelviennes : signes possibles ?",
     "Pesanteur, douleurs abdominales, troubles du transit, faux besoins, dysurie ; "
     "<b>syndrome cave inférieur</b> (œdème des MI), surtout si thrombose → écho, TDM/IRM"),
    ("2 Syndrome tumoral",
     "Splénomégalie : signes fonctionnels et complications aiguës ?",
     "Pesanteur post-prandiale, douleur de l'<b>hypochondre gauche</b>, satiété précoce, troubles du transit<br>"
     "• Douleur aiguë : <b>infarctus splénique</b> (LMC)<br>"
     "• Rupture : <b>hémopéritoine</b> + choc hypovolémique"),
    ("2 Syndrome tumoral",
     "Comment palper la rate ?",
     "Patient en <b>décubitus dorsal ou latéral droit</b>, jambes demi-fléchies.<br>"
     "Partir de la <b>fosse iliaque</b>, remonter vers l'hypochondre gauche, <b>doigts en crochet</b> "
     "sous le rebord costal, en demandant une <b>inspiration profonde</b>."),
    ("2 Syndrome tumoral",
     "Caractéristiques d'une rate palpable ? Comment mesurer ?",
     "Masse superficielle, <b>pôle inférieur arrondi</b>, <b>bord antéro-interne crénelé</b>, "
     "<b>mobile à l'inspiration</b>.<br>"
     "Mesurer le débord sous le rebord costal en cm, sur la <b>ligne médio-claviculaire</b> gauche."),
    ("2 Syndrome tumoral",
     "La rate est-elle palpable chez le sujet sain ?",
     "<b>Non</b>"),
    ("2 Syndrome tumoral",
     "Diagnostic différentiel clinique de la splénomégalie ?",
     "• Tumeur du <b>rein</b> (contact lombaire)<br>"
     "• Tumeur de la <b>queue du pancréas</b><br>"
     "• Tumeur de l'<b>angle colique gauche</b><br>"
     "→ <b>non mobiles à la respiration</b> ; confirmation par écho ou TDM"),
    ("2 Syndrome tumoral",
     "Les 4 rôles/situations de la rate qui expliquent les splénomégalies ?",
     "• <b>Épuration</b> des cellules sanguines vieillies (macrophages)<br>"
     "• <b>Organe lymphoïde secondaire</b><br>"
     "• <b>Hématopoïèse fœtale</b><br>"
     "• Située sur le <b>circuit veineux porte</b>"),
    ("2 Syndrome tumoral",
     "Les 5 grands cadres étiologiques de splénomégalie ?",
     "• <b>Infectieux</b> : bactéries (chroniques, intracellulaires), virus (EBV, CMV, hépatites), parasites (palu, leishmanies)<br>"
     "• <b>Immuno-inflammatoire</b> : maladies de système, auto-immunes<br>"
     "• <b>Mécanique</b> : hypertension portale ; rôle de filtre (hémolyse, PTI)<br>"
     "• <b>Tumoral</b> : lymphoïde (LLC, lymphomes), myéloïde (SMP, LA), solide<br>"
     "• <b>Métabolique</b> : maladies de surcharge (Gaucher, Niemann-Pick)"),
    ("2 Syndrome tumoral",
     "Atteintes neuroméningées d'une hémopathie : signes ?",
     "Syndrome méningé ; atteinte des nerfs crâniens : <b>anesthésie de la houppe du menton (V)</b>, "
     "<b>diplopie (VI)</b>, <b>paralysie faciale (VII)</b> ; compression médullaire"),
    ("2 Syndrome tumoral",
     "Hypertrophie gingivale : quelle hémopathie ?",
     "<b>Leucémies aiguës à composante monocytaire</b> (monoblastes)"),
    ("2 Syndrome tumoral",
     "Hématodermie : définition ?",
     "<b>Envahissement cutané</b> par des cellules hématopoïétiques anormales "
     "(les monocytes ont un tropisme pour la peau)"),
    ("2 Syndrome tumoral",
     "Douleurs osseuses des hémopathies : siège et contexte typique ?",
     "<b>Diaphyses proximales des os longs</b>, reproduites à la palpation.<br>"
     "Surtout dans la <b>LAL de l'enfant</b> ; peuvent précéder les autres signes."),
    ("2 Syndrome tumoral",
     "Atteinte testiculaire : contexte et intérêt ?",
     "Dans les <b>LAL</b>, à rechercher systématiquement. C'est un <b>site de rechute</b>, "
     "protégé des traitements par la barrière hémato-testiculaire."),
    ("2 Syndrome tumoral",
     "Leucostase : mécanisme ?",
     "Nombreux leucocytes immatures (<b>blastes</b>), surtout s'ils sont grands (<b>monoblastes</b>) et adhérents, "
     "dans le sang → ralentissement du flux dans les petits capillaires"),
    ("2 Syndrome tumoral",
     "Leucostase : signes et prise en charge ?",
     "• <b>Poumons</b> : dyspnée jusqu'à la détresse respiratoire, hypoxémie, images « floconneuses »<br>"
     "• <b>Cerveau</b> : signes neurologiques, troubles de vigilance, confusion<br>"
     "→ <b>Urgence thérapeutique</b> : chimiothérapie et/ou <b>leucaphérèse</b>"),
    ("2 Syndrome tumoral",
     "Pétéchies, pâleur : signes de syndrome tumoral ?",
     "<b>Non.</b> Pétéchies = syndrome <b>hémorragique</b> ; pâleur = syndrome <b>anémique</b>."),

    # ------------------------------------------------------------------ #
    # 3. HÉMOPATHIES MALIGNES (GÉNÉRALITÉS)
    # ------------------------------------------------------------------ #
    ("3 Hémopathies malignes",
     "Qu'est-ce qui définit la malignité d'une hémopathie ?",
     "Un déséquilibre entre <b>prolifération, différenciation et apoptose</b> "
     "→ accumulation de cellules anormales <b>issues d'un même clone</b>, qui échappent au contrôle"),
    ("3 Hémopathies malignes",
     "Types d'altérations génomiques acquises des hémopathies ?",
     "• <b>Mutations ponctuelles</b><br>"
     "• <b>Délétions / insertions</b><br>"
     "• <b>Translocations</b> → gènes de fusion ou surexpression"),
    ("3 Hémopathies malignes",
     "Combien d'erreurs de recopiage par division ? Facteurs de risque d'hémopathie ?",
     "Environ <b>1 à 3 erreurs</b> par division (3,2 milliards de bases)<br>"
     "Facteurs de risque : <b>radiations</b>, <b>toxiques de l'ADN</b>, défaut de réparation, "
     "inflammation chronique (« terrain fertile »)"),
    ("3 Hémopathies malignes",
     "Signes du syndrome d'hyperviscosité ? Ses 2 origines ?",
     "Céphalées, bourdonnements d'oreille, myodésopsies (« mouches »)<br>"
     "• Origine <b>cellulaire</b> : polyglobulie (voire excès de plaquettes)<br>"
     "• Origine <b>plasmatique</b> : hyperprotidémie (myélome)"),
    ("3 Hémopathies malignes",
     "Syndrome de lyse tumorale : anomalies biologiques ?",
     "• <b>Hyperkaliémie</b> (troubles du rythme)<br>"
     "• <b>Acidose métabolique</b><br>"
     "• <b>Hyperphosphatémie</b> → <b>hypocalcémie</b><br>"
     "• <b>Hyperuricémie</b> → insuffisance rénale aiguë<br>"
     "Favorisé par le <b>début des traitements cytotoxiques</b> → surveillance étroite"),
    ("3 Hémopathies malignes",
     "Marqueurs biologiques de masse tumorale ?",
     "• <b>LDH</b> : ubiquitaires, peu spécifiques (ex. SMP)<br>"
     "• <b>β2-microglobuline</b> : maladies lymphoïdes (lymphomes, myélomes)"),
    ("3 Hémopathies malignes",
     "Électrophorèse des protéines : aspect normal et dans le myélome ?",
     "• Normal : <b>dôme</b> polyclonal des gammaglobulines<br>"
     "• Myélome : <b>pic étroit monoclonal</b> (immunoglobuline produite par un seul clone)"),
    ("3 Hémopathies malignes",
     "Myélome multiple : les grandes conséquences ?",
     "• Infiltration médullaire → <b>cytopénies</b> (surtout anémie)<br>"
     "• Ig monoclonale → <b>hyperprotidémie</b> (&gt; 70 g/L), hyperviscosité, <b>pic</b> à l'électrophorèse<br>"
     "• Chaînes légères toxiques → <b>insuffisance rénale</b>, amylose<br>"
     "• <b>IL-6</b> → ostéoclastes → lacunes, douleurs, tassements, <b>hypercalcémie</b><br>"
     "• Auto-immunité possible"),
    ("3 Hémopathies malignes",
     "Myélome : examens du diagnostic ?",
     "Caractériser le composant monoclonal (<b>électrophorèse, immunofixation</b>), "
     "<b>moelle</b> (plasmocytes anormaux), <b>imagerie osseuse</b>"),
    ("3 Hémopathies malignes",
     "Quelles cytopénies sont les plus suspectes d'hémopathie ?",
     "Celles qui sont <b>arégénératives</b> (réticulocytes) et <b>multiples</b> (bi- ou pancytopénie)"),
    ("3 Hémopathies malignes",
     "Myélogramme : site, technique, intérêts et limites ?",
     "Ponction-<b>aspiration</b>, au <b>sternum</b> (manubrium) ou à l'épine iliaque postéro-supérieure → frottis<br>"
     "• <b>Cytologie</b> ; permet aussi cytométrie, cytogénétique, biologie moléculaire<br>"
     "• Rapide, faisable en urgence, quasi <b>pas de contre-indication</b> (même hémorragique)<br>"
     "• Perd l'<b>architecture</b> et en partie la richesse"),
    ("3 Hémopathies malignes",
     "Biopsie ostéo-médullaire (BOM) : site et intérêts ?",
     "Carotte osseuse à l'<b>épine iliaque postéro-supérieure</b> → <b>histologie</b> (architecture conservée)<br>"
     "• Indispensable pour les <b>lymphomes</b> et les <b>NMP</b><br>"
     "• Référence pour la <b>richesse</b> (aplasie)<br>"
     "• <b>Seul examen</b> qui montre la <b>fibrose</b> médullaire"),
    ("3 Hémopathies malignes",
     "Techniques de caractérisation des cellules anormales ?",
     "• Morphologie (cytologie / histologie)<br>"
     "• <b>Cytochimie</b> (ex. myéloperoxydase des cellules myéloïdes)<br>"
     "• Antigènes : <b>immunohistochimie</b>, <b>cytométrie en flux</b><br>"
     "• Génétique : <b>cytogénétique</b>, biologie moléculaire"),
    ("3 Hémopathies malignes",
     "Première grande distinction dans la classification des hémopathies ?",
     "<b>Myéloïde</b> (GR, plaquettes, granuleux, macrophages) ou <b>lymphoïde</b> (lymphocytes, plasmocytes)"),
    ("3 Hémopathies malignes",
     "Les 3 grandes familles d'hémopathies myéloïdes et leur mécanisme ?",
     "• <b>Néoplasies myéloprolifératives</b> (NMP / SMP) : ↑ prolifération, <b>différenciation normale</b> → excès de cellules matures<br>"
     "• <b>Néoplasies myélodysplasiques</b> : <b>différenciation anormale</b>, peu de prolifération → apoptose → cytopénies<br>"
     "• <b>Leucémies aiguës</b> : <b>blocage de différenciation</b> + prolifération → excès de blastes<br>"
     "(+ formes mixtes rares)"),
    ("3 Hémopathies malignes",
     "Les 3 NMP et la lignée en excès ?",
     "• <b>Polyglobulie de Vaquez</b> (PV) → globules rouges<br>"
     "• <b>Thrombocytémie essentielle</b> (TE) → plaquettes<br>"
     "• <b>Leucémie myéloïde chronique</b> (LMC) → granuleux (polynucléose)"),
    ("3 Hémopathies malignes",
     "NMP : présentation clinique ?",
     "Conséquences de l'excès de cellules (<b>hyperviscosité</b>, thrombose), syndrome tumoral surtout <b>splénique</b>.<br>"
     "<b>Adénopathies très rares</b> (ce ne sont pas des maladies lymphoïdes). "
     "Souvent découverte sur une NFS systématique."),
    ("3 Hémopathies malignes",
     "LMC : anomalie génétique et mécanisme ?",
     "<b>t(9;22)</b> → gène de fusion <b>BCR::ABL1</b> (BCR sur le chr 22, ABL1 sur le chr 9)<br>"
     "Tyrosine-kinase <b>constitutivement dimérisée</b> → signal de prolifération permanent, sans cytokine<br>"
     "Diagnostic : caryotype, RT-PCR ; traitement : <b>inhibiteurs de tyrosine-kinase</b>"),
    ("3 Hémopathies malignes",
     "Néoplasies myélodysplasiques : morphologie et clinique ?",
     "Dysplasie : noyau fragmenté/mal segmenté, cytoplasme dégranulé, "
     "<b>asynchronisme de maturation nucléo-cytoplasmique</b><br>"
     "Clinique : <b>insuffisance médullaire</b> (anémie au 1er plan), <b>pas de syndrome tumoral</b><br>"
     "Diagnostic : <b>myélogramme</b> devant des cytopénies arégénératives"),
    ("3 Hémopathies malignes",
     "Leucémie aiguë : critère diagnostique ?",
     "Blastes <b>&gt; 20 %</b> des cellules nucléées du <b>sang ou de la moelle</b>"),
    ("3 Hémopathies malignes",
     "Leucémie aiguë : présentation clinique ?",
     "• <b>Insuffisance médullaire</b> rapide et profonde (syndromes hémorragiques fréquents)<br>"
     "• <b>Syndrome tumoral</b> dans des tissus variés : rate, foie, peau, SNC, gencives<br>"
     "• Peut survenir de novo ou compliquer une NMP ou une NMD"),
    ("3 Hémopathies malignes",
     "Leucémie aiguë promyélocytaire : anomalie, aspect et traitement ?",
     "<b>t(15;17)</b> → <b>PML::RARA</b><br>"
     "RARA fusionné recrute une <b>histone désacétylase (HDAC)</b> au lieu d'une HAT → blocage de la différenciation au stade de promyélocyte<br>"
     "Cytologie : <b>corps d'Auer en fagots</b><br>"
     "Traitement : <b>acide rétinoïque</b> à fortes doses"),
    ("3 Hémopathies malignes",
     "Hémopathies lymphoïdes selon le stade de la cellule touchée ?",
     "• Précurseurs (blastes) : <b>leucémie aiguë lymphoblastique</b> (enfant +++)<br>"
     "• Cellules matures en maturation : <b>syndromes lymphoprolifératifs</b> (LLC) et <b>lymphomes</b><br>"
     "• Plasmocytes : <b>myélome multiple</b>"),
    ("3 Hémopathies malignes",
     "LAL ou LAM : pronostic ? Examen clé pour les distinguer ?",
     "• <b>LAL</b> (enfant) : <b>guérie dans la majorité des cas</b><br>"
     "• <b>LAM</b> : souvent bien plus agressive<br>"
     "Distinction par la <b>cytométrie en flux</b> (antigènes de lignée B/T, stade de maturation)"),
    ("3 Hémopathies malignes",
     "LLC : quelles cellules et quel frottis ?",
     "Petits <b>lymphocytes B matures monoclonaux</b> (surtout un défaut d'apoptose)<br>"
     "Frottis : lymphocytes <b>monotones</b>, fragiles → noyaux nus = <b>ombres de Gumprecht</b>"),
    ("3 Hémopathies malignes",
     "LLC : confirmation diagnostique ?",
     "<b>Immunophénotypage</b> : une <b>seule chaîne légère</b> (normalement κ 2/3, λ 1/3) "
     "+ combinaison d'antigènes du <b>score de Matutes</b>"),
    ("3 Hémopathies malignes",
     "LLC : circonstances de découverte et complications ?",
     "Le plus souvent une <b>NFS systématique</b> (hyperlymphocytose).<br>"
     "Plus tard : syndrome tumoral (rate, ganglions), cytopénies par envahissement, "
     "<b>auto-immunité</b> (AHAI, hémophilie acquise)"),
    ("3 Hémopathies malignes",
     "Lymphomes : présentation ?",
     "<b>Syndrome tumoral</b> (ganglions, rate, mais aussi tube digestif, peau, poumon, SNC) ; "
     "envahissement médullaire inconstant ; <b>signes généraux</b> : fièvre, sueurs nocturnes, amaigrissement"),
    ("3 Hémopathies malignes",
     "Leucémie aiguë, aplasie médullaire, myélome : sont-ils des syndromes myéloprolifératifs ?",
     "<b>Non.</b><br>• LA : blocage de maturation<br>• Aplasie : disparition de la moelle<br>"
     "• Myélome : hémopathie <b>lymphoïde</b> (plasmocytes)"),

    # ------------------------------------------------------------------ #
    # 4. POLYGLOBULIES
    # ------------------------------------------------------------------ #
    ("4 Polyglobulies",
     "Définition de la polyglobulie ? Sur quels paramètres de la NFS la suspecte-t-on ?",
     "Augmentation du <b>volume globulaire total</b> (masse de GR dans l'organisme)<br>"
     "Suspectée sur l'<b>hémoglobine</b> et l'<b>hématocrite</b> (pas le nombre de GR)"),
    ("4 Polyglobulies",
     "Volumes plasmatique et globulaire normaux ?",
     "VP ≈ <b>45 mL/kg</b> ; VG ≈ <b>30 mL/kg</b> (≈ 40 à 45 % du volume sanguin total = hématocrite)"),
    ("4 Polyglobulies",
     "Seuils qui doivent inquiéter : hématocrite et Hb ?",
     "Hématocrite : <b>&gt; 50 %</b> (homme), <b>&gt; 45 %</b> (femme)<br>"
     "Hb : <b>&gt; 18,5 g/dL</b> (homme), <b>&gt; 16,5 g/dL</b> (femme)"),
    ("4 Polyglobulies",
     "Les 3 fausses polyglobulies classiques ?",
     "• <b>Déshydratation</b> (hémoconcentration, ↓ VP, protides ↑)<br>"
     "• <b>Thalassémie</b> (nombre de GR ↑ mais Hb/Ht normaux, microcytose)<br>"
     "• <b>Syndrome de Gaisböck</b>"),
    ("4 Polyglobulies",
     "Syndrome de Gaisböck : terrain et mécanisme ?",
     "<b>Homme ~50 ans</b>, légère obésité, HTA, hypercholestérolémie, souvent fumeur<br>"
     "<b>Contraction du volume plasmatique</b> (dérèglement métabolique) → pseudo-polyglobulie"),
    ("4 Polyglobulies",
     "Thalassémie : pourquoi un nombre de GR élevé ne veut pas dire polyglobulie ?",
     "Défaut de synthèse d'Hb → <b>microcytose</b> (VGM &lt; 80 fL) compensée par plus de GR, "
     "mais <b>Hb et hématocrite normaux</b> → le volume globulaire n'est pas augmenté"),
    ("4 Polyglobulies",
     "Quel examen affirme une polyglobulie vraie ? Principe et seuil ?",
     "<b>Mesure isotopique de la masse globulaire</b> : GR marqués au <b>chrome 51</b>, réinjectés, "
     "dilution → volume globulaire total<br>"
     "Polyglobulie si <b>&gt; 120 %</b> de la valeur théorique <i>(la restitution dit &gt; 125 %)</i><br>"
     "La NFS fait <b>suspecter</b>, la masse globulaire <b>affirme</b>."),
    ("4 Polyglobulies",
     "EPO : lieu de synthèse, stimulus, cellules cibles ?",
     "Synthèse par le <b>rein</b> en réponse à l'<b>hypoxie tissulaire</b><br>"
     "Récepteurs exprimés à partir du <b>CFU-E</b> jusqu'aux derniers stades<br>"
     "<b>Seule cytokine de l'érythropoïèse terminale</b>"),
    ("4 Polyglobulies",
     "Régulation de HIF-1α en <b>normoxie</b> ?",
     "Les <b>prolyl-hydroxylases</b> (centre à fer) hydroxylent HIF-1α → reconnu par <b>VHL</b> "
     "→ ubiquitinylation → dégradation par le <b>protéasome</b> → pas d'EPO"),
    ("4 Polyglobulies",
     "Régulation de HIF-1α en <b>hypoxie</b> ?",
     "Prolyl-hydroxylases inhibées → HIF-1α non reconnu par VHL → <b>stable</b>, "
     "s'associe à HIF-1β → transcription du gène de l'<b>EPO</b> ↑"),
    ("4 Polyglobulies",
     "Effets de l'EPO sur l'érythropoïèse ?",
     "1er effet : <b>supprime l'apoptose physiologique</b> (réponse rapide)<br>"
     "puis <b>augmente la prolifération</b>"),
    ("4 Polyglobulies",
     "Signalisation du récepteur de l'EPO ?",
     "Récepteur <b>dimérique</b> → rapprochement et transphosphorylation de <b>JAK2</b><br>"
     "Effecteurs : <b>STAT5</b> (gènes anti-apoptotiques comme Bcl-xL, pro-prolifération), "
     "<b>PI3K-AKT</b>, <b>MAP kinases</b>"),
    ("4 Polyglobulies",
     "Polyglobulie primitive ou secondaire : apport du dosage de l'EPO ?",
     "• <b>Primitive</b> : la moelle produit seule → <b>EPO basse</b> (Vaquez, mutation du R-EPO)<br>"
     "• <b>Secondaire</b> : <b>EPO élevée</b> (ou normale)"),
    ("4 Polyglobulies",
     "Polyglobulies secondaires avec sécrétion <u>appropriée</u> d'EPO (hypoxie) : causes ?",
     "• <b>Altitude</b><br>"
     "• <b>Insuffisance respiratoire</b> chronique (BPCO)<br>"
     "• <b>Tabac</b> (CO → carboxyhémoglobine) : cause très fréquente<br>"
     "• <b>Apnées du sommeil</b> (sous-diagnostiquées)<br>"
     "• Shunts artério-veineux : <b>cardiopathies cyanogènes</b><br>"
     "• <b>Hb hyperaffines</b> (rare)"),
    ("4 Polyglobulies",
     "Hémoglobine hyperaffine : mécanisme ?",
     "<b>p50 basse</b> → l'Hb ne relargue pas l'O₂ → <b>hypoxie tissulaire sans hypoxémie</b> "
     "(gaz du sang normaux)<br>Mutation constitutionnelle → contexte <b>familial</b>, présente depuis toujours"),
    ("4 Polyglobulies",
     "Polyglobulies secondaires avec sécrétion <u>inappropriée</u> d'EPO : causes ?",
     "• <b>Tumeurs</b> sécrétant de l'EPO (paranéoplasique) : <b>cancer du rein</b> +++, foie, ovaire, utérus → <b>écho abdominale</b><br>"
     "• <b>Dopage</b> à l'EPO<br>"
     "• <b>Androgènes</b>"),
    ("4 Polyglobulies",
     "Le cancer du rein donne-t-il une polyglobulie primitive ?",
     "<b>Non</b> : c'est une polyglobulie <b>secondaire inappropriée</b> (la tumeur sécrète de l'EPO → <b>EPO élevée</b>)."),
    ("4 Polyglobulies",
     "Causes rares de polyglobulie secondaire d'origine moléculaire ?",
     "Mutations de la voie de détection de l'hypoxie (<b>HIF, VHL, prolyl-hydroxylases</b>) "
     "→ polyglobulie <b>familiale</b> → antécédents familiaux +++"),
    ("4 Polyglobulies",
     "Polyglobulie de Vaquez : nature ?",
     "<b>Hémopathie maligne clonale</b>, <b>syndrome myéloprolifératif</b>, anomalie génétique <b>acquise</b> "
     "de la <b>cellule souche</b> → la lignée érythroblastique pousse <b>sans EPO</b>"),
    ("4 Polyglobulies",
     "Vaquez : mutation responsable et mécanisme ?",
     "<b>JAK2 V617F</b> (valine 617 → phénylalanine), sur le domaine <b>pseudo-kinase JH2</b><br>"
     "JH2 n'inhibe plus le domaine kinase <b>JH1</b> → JAK2/STAT5 <b>constitutivement actifs</b> même sans EPO"),
    ("4 Polyglobulies",
     "Vaquez : apport de la culture de progéniteurs ?",
     "<b>Pousse spontanée</b> de colonies érythroïdes <b>sans EPO</b> "
     "(chez le sujet normal, rien ne pousse sans EPO)"),
    ("4 Polyglobulies",
     "Vaquez : aspect de la moelle à la BOM ?",
     "Moelle <b>riche</b> avec <b>panmyélose</b> : ↑ des lignées érythroïde, granuleuse et mégacaryocytaire "
     "(contrairement aux polyglobulies secondaires)"),
    ("4 Polyglobulies",
     "Polyglobulie par mutation du récepteur de l'EPO : mécanisme ?",
     "R-EPO <b>tronqué</b> → perte des rétrocontrôles négatifs → <b>hypersensibilité</b> à l'EPO "
     "(et non indépendance)<br><b>Autosomique dominante</b>, familiale, espérance de vie normale, très rare"),
    ("4 Polyglobulies",
     "Signes cliniques d'une polyglobulie ?",
     "• <b>Érythrose</b> cutanéo-muqueuse (faciès, paumes, conjonctives)<br>"
     "• <b>Hyperviscosité</b> : céphalées, acouphènes, phosphènes, somnolence, vision floue<br>"
     "• <b>HTA</b><br>"
     "• <b>Thromboses</b> artérielles ou veineuses (risque majeur)"),
    ("4 Polyglobulies",
     "Signes évocateurs d'une maladie de Vaquez ?",
     "• <b>Prurit aquagénique</b> (après la douche chaude)<br>"
     "• <b>Splénomégalie</b><br>"
     "• Atteinte des autres lignées : <b>thrombocytose</b>, <b>hyperleucocytose à PNN</b><br>"
     "• EPO basse + JAK2 V617F"),
    ("4 Polyglobulies",
     "VGM dans une polyglobulie vraie ?",
     "<b>Normal</b> (parfois ↓ dans le Vaquez par carence martiale), "
     "à l'inverse des fausses polyglobulies microcytaires (thalassémie)"),
    ("4 Polyglobulies",
     "À partir de quel hématocrite la polyglobulie est-elle une urgence ? Traitement ?",
     "Hématocrite <b>&gt; 60 %</b> (surtout si signes d'hyperviscosité)<br>"
     "→ <b>Saignées</b> de 400 à 500 mL"),
    ("4 Polyglobulies",
     "Buts des saignées ?",
     "• <b>Diminuer la masse de GR</b><br>• <b>Induire une carence en fer</b> pour freiner la production"),
    ("4 Polyglobulies",
     "Risques évolutifs de la maladie de Vaquez ?",
     "• <b>Thrombose</b> (plus fréquente que dans les autres polyglobulies à hématocrite égal)<br>"
     "• Évolution vers la <b>myélofibrose</b> (jusqu'aux cytopénies)<br>"
     "• Transformation en <b>leucémie aiguë</b><br>"
     "• Hyperuricémie : goutte, insuffisance rénale"),
    ("4 Polyglobulies",
     "Bilan de 1ère ligne d'une polyglobulie : interprétation JAK2 / EPO ?",
     "• JAK2 V617F + et EPO basse → <b>Vaquez</b><br>"
     "• JAK2 + et EPO normale → probablement Vaquez (culture de progéniteurs, BOM)<br>"
     "• JAK2 − et EPO basse → Vaquez sans mutation ou <b>mutation du R-EPO</b> (rares)<br>"
     "• JAK2 − et EPO normale/élevée → <b>secondaire</b>, après avoir vérifié que c'est une vraie polyglobulie "
     "(masse globulaire : éliminer déshydratation, Gaisböck)"),
    ("4 Polyglobulies",
     "1ère hématocrite &gt; 50 % sans urgence : conduite ?",
     "Conseiller de <b>bien s'hydrater</b> et <b>recontrôler</b> (persistance ?) avant le bilan"),
    ("4 Polyglobulies",
     "Bilan étiologique d'une polyglobulie secondaire ?",
     "• Contexte respiratoire : <b>EFR</b>, recherche d'<b>apnée du sommeil</b><br>"
     "• <b>Échographie abdominale</b> : tumeurs sécrétant de l'EPO (rein, foie, ovaire) et organomégalies<br>"
     "• <b>Radio de thorax</b> : cause cardiaque ou pulmonaire<br>"
     "• Plus rare : Hb hyperaffine, mutations de la voie de l'hypoxie"),
]

CSS = """
.card { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; font-size: 20px;
        text-align: left; color: #1d1d1f; background: #ffffff; line-height: 1.45;
        padding: 8px 14px; }
.tag  { font-size: 13px; color: #8a8a8e; text-transform: uppercase; letter-spacing: .04em;
        margin-bottom: 10px; }
.q    { font-weight: 600; }
hr#answer { border: 0; border-top: 1px solid #d2d2d7; margin: 14px 0; }
b { color: #b3261e; }
.nightMode.card, .night_mode .card { color: #f2f2f7; background: #1c1c1e; }
.nightMode b, .night_mode b { color: #ff8a80; }
"""

MODEL = genanki.Model(
    1607392319,
    "Hémato Basique",
    fields=[{"name": "Recto"}, {"name": "Verso"}, {"name": "Partie"}],
    templates=[{
        "name": "Carte",
        "qfmt": '<div class="tag">{{Partie}}</div><div class="q">{{Recto}}</div>',
        "afmt": '{{FrontSide}}<hr id="answer">{{Verso}}',
    }],
    css=CSS,
)


class Note(genanki.Note):
    @property
    def guid(self):  # stable : re-importer met à jour au lieu de dupliquer
        return genanki.guid_for(self.fields[0])


def main():
    decks = {}
    for part, front, back in CARDS:
        if part not in decks:
            deck_id = 2059400110 + len(decks)
            decks[part] = genanki.Deck(deck_id, f"{ROOT}::{part}")
        tag = part.split(" ", 1)[1].replace(" ", "_").replace("-", "_")
        decks[part].add_note(Note(model=MODEL, fields=[front, back, part[2:]], tags=["hemato", tag]))

    apkg = OUT / "Hemato_3_Cytopenies_Hypercytoses_Sd_tumoral.apkg"
    genanki.Package(list(decks.values())).write_to_file(apkg)

    with open(OUT / "Hemato_3_Cytopenies_Hypercytoses_Sd_tumoral.csv", "w", newline="", encoding="utf-8") as f:
        f.write("#separator:Semicolon\n#html:true\n#tags column:3\n")
        w = csv.writer(f, delimiter=";", quoting=csv.QUOTE_ALL)
        for part, front, back in CARDS:
            w.writerow([front, back, "hemato " + part.split(" ", 1)[1].replace(" ", "_")])

    counts = {p: len(d.notes) for p, d in decks.items()}
    print(apkg.name, sum(counts.values()), "cartes", counts)


if __name__ == "__main__":
    main()
