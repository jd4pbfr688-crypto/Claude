#!/usr/bin/env python3
"""Assemble le diaporama « Les degrés de liberté » en un seul fichier HTML.

src/ contient le moteur du premier cours (repris tel quel : 10-style, 30-hud, 40-engine,
50-chart-parts, 90-input-boot) et ce qui est propre à ce cours (00-head, 15-style-ddl,
20-stations, 60-scenes-ddl).
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "src"
PARTS = ["00-head.html", "10-style.html", "15-style-ddl.html", "20-stations.html",
         "30-hud-script-open.html", "40-engine.js", "50-chart-parts.js", "60-scenes-ddl.js",
         "90-input-boot.js"]

out = "\n".join((SRC / p).read_text(encoding="utf-8").rstrip("\n") for p in PARTS) + "\n"
(HERE / "degres-de-liberte.html").write_text(out, encoding="utf-8")
print(f"degres-de-liberte.html : {len(out.encode()):,} octets")
