#!/usr/bin/env python3
"""Fiche de données du cours 2 (tests d'hypothèses) : recalcule chaque nombre affiché dans les diapos.

Sources : la population et G1 du cours 1 (largeurs de main, N = 30), l'échantillon H (handballeurs,
généré une fois pour toutes), l'exemple des quartiers du poly du Pr Morin. Usage : python3 donnees.py
(nécessite scipy ; arrondis comme dans les tables : 2 décimales, 3 pour 1,645 / 2,326 / 2,576).
"""
from math import sqrt
from scipy import stats

N = 30
SIG2 = 22.5                                  # cours 1 : variance de la population (mm²)
MU_VRAI = 70.0                               # cours 1 : moyenne de la population (mm)
G1 = [58, 63, 65, 67, 67, 68, 68, 68, 69, 69, 69, 69, 70, 70, 70, 70, 71, 71, 71, 72, 72, 73, 74, 74, 74, 74, 75, 75, 75, 81]
H = [64, 68, 69, 69, 70, 71, 71, 72, 72, 72, 72, 73, 74, 74, 75, 76, 76, 77, 77, 78, 78, 78, 78, 78, 79, 80, 80, 81, 82, 83]
MU0, PHI0 = 72.5, 0.20                       # hypothèses H₀ du fabricant

def resume(v):
    n = len(v); m = sum(v) / n; se2 = sum((x - m) ** 2 for x in v) / n
    return n, m, se2, se2 * n / (n - 1), sum(x >= 72 for x in v)

z = lambda a: stats.norm.ppf(1 - a)          # seuil d'une queue de surface a
lignes = []
def L(nom, val, fmt='{:.3f}'): lignes.append((nom, fmt.format(val) if isinstance(val, float) else str(val)))

n, m1, se1, s1, k1 = resume(G1)
_, m2, se2, s2, k2 = resume(H)
sem = sqrt(SIG2 / N)
L('σ/√N (mm)', sem)
L('G1 : mₑ', m1, '{:.2f}'); L('G1 : Sₑ²', se1, '{:.2f}'); L('G1 : s² ; s', f'{s1:.2f} ; {sqrt(s1):.2f}'); L('G1 : Sₑ', sqrt(se1), '{:.2f}'); L('G1 : mains ≥ 72', k1)
L('H : mₑ', m2, '{:.2f}'); L('H : Sₑ²', se2, '{:.2f}'); L('H : S²', s2, '{:.2f}'); L('H : mains ≥ 72', k2)

# II · le raisonnement (σ connu, comme l'intervalle de pari du cours 1)
for a in (0.05, 0.01):
    za = z(a / 2)
    L(f'IP {a:.0%} autour de 72,5', f'[{MU0 - za * sem:.2f} ; {MU0 + za * sem:.2f}]  (ε(α) = {za:.3f})')
    lo, hi = MU0 - za * sem, MU0 + za * sem
    for mu in (MU_VRAI, 71.5, 69.0):
        b = stats.norm.cdf((hi - mu) / sem) - stats.norm.cdf((lo - mu) / sem)
        L(f'β à {a:.0%} si μ = {mu}', f'{b:.3f}  (puissance {1 - b:.3f})')
eps = abs(m1 - MU0) / sem
L('ε = |70,4 − 72,5| / 0,866', eps); L('p bilatéral', 2 * (1 - stats.norm.cdf(eps)), '{:.4f}')
L('ε(2α) pour α = 1 % (unilatéral)', z(0.01)); L('ε(2α) pour α = 5 %', z(0.05))

# III · conformité
f = k1 / N; e = abs(f - PHI0) / sqrt(PHI0 * (1 - PHI0) / N)
L('fréquence : f, Nϕ, N(1−ϕ)', f'{f:.3f} ; {N * PHI0:.0f} ; {N * (1 - PHI0):.0f}')
L('fréquence : dénominateur, ε, p', f'{sqrt(PHI0 * (1 - PHI0) / N):.4f} ; {e:.2f} ; {2 * (1 - stats.norm.cdf(e)):.3f}')
d = abs(m1 - MU0) / (sqrt(s1) / sqrt(N))
L('moyenne : s/√N, δ', f'{sqrt(s1) / sqrt(N):.3f} ; {d:.2f}')
L('t(5 %), t(1 %) à 29 ddl', f'{stats.t.ppf(0.975, 29):.3f} ; {stats.t.ppf(0.995, 29):.3f}')
chi = N * se1 / SIG2
L('variance : χ² ; bornes 29 ddl', f'{chi:.2f} ; [{stats.chi2.ppf(0.025, 29):.2f} ; {stats.chi2.ppf(0.975, 29):.2f}]')

# IV · homogénéité (G1 = 1, H = 2 ; pour F, 1 = la plus grande variance)
fc = (k1 + k2) / (2 * N); e2 = abs(k1 / N - k2 / N) / sqrt(fc * (1 - fc) * (2 / N))
L('fréquences : f₁, f₂, f conjointe', f'{k1 / N:.3f} ; {k2 / N:.3f} ; {fc:.3f}')
L('fréquences : dénominateur, ε, p', f'{sqrt(fc * (1 - fc) * 2 / N):.3f} ; {e2:.2f} ; {2 * (1 - stats.norm.cdf(e2)):.4f}')
F = max(s1, s2) / min(s1, s2)
L('variances : F ; F(α/2) à (29 ; 29)', f'{F:.2f} ; {stats.f.ppf(0.975, 29, 29):.2f}')
sp = (N * se1 + N * se2) / (2 * N - 2); dm = abs(m1 - m2) / sqrt(sp / N + sp / N)
L('moyennes : S² commun, √(…), δ', f'{sp:.2f} ; {sqrt(2 * sp / N):.3f} ; {dm:.2f}')
L('moyennes : t(5 %) à 58 ddl, p', f'{stats.t.ppf(0.975, 58):.2f} ; {2 * (1 - stats.t.cdf(dm, 58)):.5f}')

# V · χ² (quartiers du poly, puis la table 2 × 2 G1/H)
def khi2(O):
    R = [sum(r) for r in O]; C = [sum(c) for c in zip(*O)]; T = sum(R)
    E = [[r * c / T for c in C] for r in R]
    K = [[(o - e) ** 2 / e for o, e in zip(oo, ee)] for oo, ee in zip(O, E)]
    return E, K, sum(map(sum, K)), (len(O) - 1) * (len(O[0]) - 1)
E, K, x2, ddl = khi2([[12, 60, 28], [31, 45, 24]])
L('quartiers : C', E); L('quartiers : (O−C)²/C', [[round(v, 2) for v in r] for r in K]); L('quartiers : χ², ddl, seuil 5 %', f'{x2:.3f} ; {ddl} ; {stats.chi2.ppf(0.95, ddl):.2f}')
E, K, x2, ddl = khi2([[k1, N - k1], [k2, N - k2]])
L('2 × 2 G1/H : C', E); L('2 × 2 : χ², = ε² ?', f'{x2:.3f} ; ε² = {e2 ** 2:.3f} ; seuil {stats.chi2.ppf(0.95, 1):.2f} = 1,96² = {1.96 ** 2:.2f}')

w = max(len(a) for a, _ in lignes)
for a, b in lignes: print(a.ljust(w), ' ', b)
