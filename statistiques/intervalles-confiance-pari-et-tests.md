# Intervalles de confiance, intervalles de pari et tests d'hypothèse

> Notes reprises et mises au propre à partir de l'enregistrement du cours.
> Les erreurs de la transcription automatique sont listées en [fin de document](#6-corrections-de-la-transcription).

---

## 1. Rappel : échantillon ↔ population

Tout le chapitre des statistiques probabilistes répond à une seule question : **comment relier ce qu'on observe dans un échantillon à ce qui est vrai dans la population ?**

|                                   | Population (valeurs « vraies ») | Échantillon (valeurs observées) |
|-----------------------------------|:-------------------------------:|:-------------------------------:|
| Fréquence                         | $\varphi$                       | $f$                             |
| Moyenne                           | $\mu$                           | $m$                             |
| Variance / écart-type             | $\sigma^2$ / $\sigma$           | $s^2$ / $s$                     |

Il y a **trois usages** de ce lien :

| Outil                            | On part de…                | Pour…                                      | Verbe        |
|----------------------------------|----------------------------|--------------------------------------------|--------------|
| **Intervalle de confiance (IC)** | l'échantillon (connu)      | encadrer la valeur de la population        | **estimer**  |
| **Intervalle de pari (IP)**      | la population (connue)     | prévoir les valeurs d'un échantillon       | **prévoir**  |
| **Test d'hypothèse**             | une hypothèse + un échantillon | dire si l'écart observé est dû au hasard | **décider**  |

---

## 2. Le multiplicateur : $\varepsilon$, $t$ ou $\chi^2$

Tous les intervalles ont la même structure :

$$
\text{valeur centrale} \;\pm\; \underbrace{\text{multiplicateur}}_{\varepsilon_\alpha,\ t_\alpha\ \ldots} \times \text{écart-type}
$$

Le multiplicateur répond à la question : **par combien dois-je multiplier mon écart-type pour n'avoir qu'un risque $\alpha$ de tomber en dehors ?** Il fait le lien entre la probabilité de tomber sur la bonne valeur et la largeur de l'intervalle. Il dépend de la **loi** suivie par la valeur étudiée.

### Rappel sur la loi normale centrée réduite

- $\pm 1$ écart-type autour de la moyenne ≈ **68 %** de la population.
- $\pm 1{,}96$ écart-type ≈ **95 %** de la population → c'est $\varepsilon_{0,05}$.

### Lire la table de l'écart-réduit

La ligne donne le début de $\alpha$, la colonne le chiffre suivant.
Pour $\alpha = 0{,}05$ : ligne **0,0**, colonne **0,05** → **1,960**.

> **À retenir : $\varepsilon_{0,05} = 1{,}96$.** C'est la seule valeur de la table à connaître par cœur.
> (Pour information : $\varepsilon_{0,10} = 1{,}645$ et $\varepsilon_{0,01} = 2{,}576$.)

Les tables de Student et du $\chi^2$ se lisent différemment (elles dépendent aussi du nombre de degrés de liberté, ddl). En cours, elles ont été montrées uniquement pour comprendre le principe.

### Quelle loi, quel multiplicateur ?

| Paramètre                  | Conditions de validité                              | Loi                           | Multiplicateur        |
|----------------------------|-----------------------------------------------------|-------------------------------|-----------------------|
| Fréquence (IC)             | $nf \ge 5$ **et** $n(1-f) \ge 5$                    | Gauss (normale)               | $\varepsilon_\alpha$  |
| Fréquence (IP)             | $n\varphi \ge 5$ **et** $n(1-\varphi) \ge 5$        | Gauss (normale)               | $\varepsilon_\alpha$  |
| Moyenne, $\sigma$ connu    | caractère gaussien **ou** $n \ge 30$                | Gauss (normale)               | $\varepsilon_\alpha$  |
| Moyenne, $\sigma$ inconnu  | caractère gaussien **ou** $n \ge 30$                | Student, $n-1$ ddl            | $t_\alpha$            |
| Variance                   | caractère gaussien                                  | Pearson ($\chi^2$), $n-1$ ddl | $\chi^2$              |

Idée générale pour la loi normale : **tout tend vers une gaussienne** quand $n$ est assez grand — d'où les conditions $\ge 5$ et $\ge 30$.

Arbre de décision pour une moyenne :

```
Caractère gaussien OU n ≥ 30 ?
├── Non → tests non paramétriques (hors programme de cette séance)
└── Oui → σ connu ?
          ├── Oui → loi de Gauss    → ε_α
          └── Non → loi de Student  → t_α (n − 1 ddl)
```

> **Deux échantillons** (différence de moyennes, de fréquences…) : les vérifications se font **pour chacun des échantillons**.

---

## 3. Formules

| Outil                               | Formule                                                                                      |
|-------------------------------------|----------------------------------------------------------------------------------------------|
| IP d'une fréquence                  | $\varphi \pm \varepsilon_\alpha \sqrt{\dfrac{\varphi(1-\varphi)}{n}}$                        |
| IC d'une fréquence                  | $f \pm \varepsilon_\alpha \sqrt{\dfrac{f(1-f)}{n}}$                                          |
| IP d'une moyenne                    | $\mu \pm \varepsilon_\alpha \dfrac{\sigma}{\sqrt{n}}$                                        |
| IC d'une moyenne, $\sigma$ connu    | $m \pm \varepsilon_\alpha \dfrac{\sigma}{\sqrt{n}}$                                          |
| IC d'une moyenne, $\sigma$ inconnu  | $m \pm t_{\alpha;\,n-1} \dfrac{s}{\sqrt{n}}$, avec $s^2 = \dfrac{\sum (x_i - m)^2}{n-1}$     |
| IC d'une variance                   | $\left[ \dfrac{(n-1)\,s^2}{\chi^2_{\text{sup}}} \;;\; \dfrac{(n-1)\,s^2}{\chi^2_{\text{inf}}} \right]$, $n-1$ ddl |

Pour l'IC de la variance, $\chi^2_{\text{sup}}$ est la valeur qui laisse $\alpha/2$ à sa droite et $\chi^2_{\text{inf}}$ celle qui laisse $\alpha/2$ à sa gauche (l'intervalle n'est pas symétrique).

Remarque : l'IP part de $\varphi$ ou $\mu$ (population), l'IC part de $f$ ou $m$ (échantillon). C'est la seule différence d'écriture pour une fréquence ou une moyenne à $\sigma$ connu.

---

## 4. Troisième usage : **décider** (test d'hypothèse)

### L'exemple de la pièce

On lance une pièce $n = 10$ fois. **Face = succès**, pile = échec.
Pour une pièce normale : $\varphi = \dfrac{1 \text{ issue favorable}}{2 \text{ issues possibles}} = 0{,}5$.

| Cas | Résultat     | $f$  | $f = \varphi$ ? | Pièce truquée ? |
|-----|--------------|------|-----------------|-----------------|
| A   | 6 faces / 10 | 0,6  | non             | **non**         |
| B   | 10 faces / 10| 1    | non             | **oui**         |

Dans les deux cas $f \ne \varphi$ et l'échantillon a la même taille. Pourquoi deux conclusions différentes ?
Parce que la question n'est pas « $f$ est-il différent de $\varphi$ ? » (il l'est presque toujours, à cause des **fluctuations d'échantillonnage**), mais **« quelle est la probabilité d'observer un tel résultat avec une pièce normale ? »**

Ordre de grandeur (loi binomiale exacte, pièce normale) :

- obtenir **6 faces ou plus** sur 10 : $386/1024 \approx$ **37,7 %** → banal ;
- obtenir **10 faces** sur 10 : $1/1024 \approx$ **0,1 %** → très improbable.

### Méthode : l'intervalle de pari

On connaît la valeur théorique ($\varphi = 0{,}5$, population) et on veut savoir où devraient tomber les fréquences d'échantillon → **intervalle de pari**.

1. **Conditions** : $n\varphi = 10 \times 0{,}5 = 5 \ge 5$ et $n(1-\varphi) = 5 \ge 5$ ✔ (tout juste).
2. **Calcul** avec $\alpha = 5\,\%$ :

$$
\sqrt{\frac{0{,}5 \times 0{,}5}{10}} = \sqrt{0{,}025} \approx 0{,}158
\qquad
1{,}96 \times 0{,}158 \approx 0{,}31
$$

$$
IP_{95\,\%} = 0{,}5 \pm 0{,}31 = [\,0{,}19 \;;\; 0{,}81\,]
$$

3. **Décision** :
   - Cas A : $f = 0{,}6 \in [0{,}19 ; 0{,}81]$ → résultat compatible avec une pièce normale : **on ne rejette pas** l'hypothèse « pièce normale ».
   - Cas B : $f = 1 > 0{,}81$ → résultat hors de l'intervalle : **on rejette** l'hypothèse « pièce normale », avec un risque $\alpha = 5\,\%$ de se tromper.

### Même raisonnement, écrit comme un test

- Hypothèse nulle $H_0$ : $\varphi = 0{,}5$ (pièce normale).
- Hypothèse alternative $H_1$ : $\varphi \ne 0{,}5$ (pièce truquée).
- On calcule l'écart-réduit $\varepsilon = \dfrac{f - \varphi}{\sqrt{\varphi(1-\varphi)/n}}$ et on le compare à $1{,}96$ (en valeur absolue) :

| Cas | $\varepsilon$ calculé              | Comparaison     | Conclusion            |
|-----|------------------------------------|-----------------|-----------------------|
| A   | $0{,}1 / 0{,}158 \approx 0{,}63$   | $< 1{,}96$      | on ne rejette pas $H_0$ |
| B   | $0{,}5 / 0{,}158 \approx 3{,}16$   | $> 1{,}96$      | on rejette $H_0$      |

C'est exactement la même chose que regarder si $f$ tombe dans l'IP.

### ⚠️ Nuance importante sur le risque $\alpha$

$\alpha$ est le risque de **rejeter à tort** $H_0$ (déclarer la pièce truquée alors qu'elle est normale).
Quand $f$ tombe dans l'IP, on **ne prouve pas** que la pièce est normale : on dit seulement qu'on n'a pas de raison suffisante de conclure qu'elle est truquée. Le risque de se tromper dans ce sens-là (noté $\beta$) n'est pas contrôlé par $\alpha$.

Avec seulement 10 lancers, il est même énorme : une pièce truquée qui tombe sur face 60 % du temps donnerait un résultat dans $[0{,}19 ; 0{,}81]$ environ **95 % du temps**. Pour détecter de petits écarts, il faut de grands échantillons.

---

## 5. À retenir

1. **IC** : échantillon → population (**estimer**). **IP** : population → échantillon (**prévoir**). **Test** : **décider** si un écart est dû au hasard.
2. $\varepsilon$, $t$, $\chi^2$ ne sont que des **multiplicateurs** de l'écart-type, qui dépendent de la loi suivie.
3. **Vérifier les conditions** avant tout calcul ($\ge 5$ pour les fréquences, gaussien ou $n \ge 30$ pour les moyennes, gaussien pour les variances ; pour chaque échantillon s'il y en a deux).
4. $\varepsilon_{0,05} = 1{,}96$.
5. Une valeur observée **différente** de la valeur théorique n'est pas forcément **significativement différente** : tout dépend de sa probabilité de survenue sous l'hypothèse testée.

---

## 6. Corrections de la transcription

| Transcrit                                                     | À lire                                                         |
|---------------------------------------------------------------|----------------------------------------------------------------|
| « intervalle de Paris »                                       | intervalle de **pari**                                         |
| « epsilon, tau ou psi »                                       | $\varepsilon$ (Gauss), $t$ (Student) ou $\chi^2$ (khi-deux)    |
| « la valeur de petit 2 »                                      | la valeur du **khi-deux** ($\chi^2$)                           |
| « la valeur de comparaison des petits échantillons »          | la loi de **Student** (loi des petits échantillons)            |
| « pour une moyenne inconnue »                                 | pour une moyenne avec **$\sigma$ inconnu**                     |
| « caractère quotient »                                        | caractère **gaussien**                                         |
| « la base de Pearson »                                        | la **loi de Pearson** (= loi du $\chi^2$)                      |
| « le nombre de faces, 5, divisé par la probabilité totale »   | 1 issue favorable sur 2 issues possibles → $\varphi = 0{,}5$   |
| « 2 fois 5 fois 5 divisé par 10 »                             | $\approx 2 \times \sqrt{0{,}5 \times 0{,}5 / 10}$             |
| « entre 0,19 et 0,85 »                                        | entre 0,19 et **0,81**                                         |
| « si j'ai un échec, si j'ai 6 faces sur 10 »                  | si j'ai 6 faces sur 10                                         |
| « je la rachète »                                             | je la **rejette**                                              |
