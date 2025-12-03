import json
from pathlib import Path

base = Path('frontend/lighthouse-reports/2025-11-30T09-12-05-375Z-auth')
for path in sorted(base.glob('*.report.json')):
    data = json.loads(path.read_text())
    cats = data['categories']
    scores = {key: round(cats[key]['score'] * 100) for key in ['performance', 'accessibility', 'best-practices', 'seo']}
    print(f"{path.stem}: {scores}")
