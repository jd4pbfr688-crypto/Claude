#!/usr/bin/env python3
"""Planches de contrôle : 4 étapes par image (2×2), légendées. Usage : planches.py <dossier etapes> <sortie> [filtre]"""
import sys, pathlib
from PIL import Image, ImageDraw
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
flt = sys.argv[3] if len(sys.argv) > 3 else ''
files = sorted(p for p in src.glob('*.png') if flt in p.name)
for s in range(0, len(files), 4):
    sheet = Image.new('RGB', (1920, 1080 + 60), 'white'); d = ImageDraw.Draw(sheet)
    for j, f in enumerate(files[s:s + 4]):
        im = Image.open(f).convert('RGB').resize((956, 538), Image.LANCZOS)
        x, y = (j % 2) * 964, (j // 2) * 568 + 26
        sheet.paste(im, (x, y)); d.rectangle([x, y, x + 955, y + 537], outline=(160, 160, 160))
        d.text((x + 6, y - 22), f.stem, fill=(200, 0, 0))
    sheet.save(out / f'planche-{s//4+1:02d}.png')
print(len(files), 'étapes,', (len(files) + 3) // 4, 'planches')
