#!/usr/bin/env python3
"""Проставляет в sitemap.xml дату последнего коммита каждой страницы.

Запускается из GitHub Actions после пуша в main. Ничего не выдумывает:
lastmod берётся из git-истории конкретного файла, а не из «сегодня».
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITEMAP = ROOT / "sitemap.xml"
BASE = "https://antonioavanzato.github.io/"


def last_commit_date(path):
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", path],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.strip()
    return out or None


def page_for(loc):
    tail = loc[len(BASE):] if loc.startswith(BASE) else loc
    return "index.html" if tail in ("", "/") else tail


def main():
    xml = SITEMAP.read_text(encoding="utf-8")
    original = xml

    for block in re.findall(r"<url>.*?</url>", xml, re.S):
        loc = re.search(r"<loc>(.*?)</loc>", block, re.S)
        if not loc:
            continue
        page = page_for(loc.group(1).strip())
        if not (ROOT / page).exists():
            print(f"пропуск: {page} нет в репозитории", file=sys.stderr)
            continue
        date = last_commit_date(page)
        if not date:
            continue
        updated = re.sub(r"<lastmod>.*?</lastmod>", f"<lastmod>{date}</lastmod>", block, flags=re.S)
        if updated != block:
            xml = xml.replace(block, updated)

    if xml == original:
        print("sitemap.xml уже актуален")
        return
    SITEMAP.write_text(xml, encoding="utf-8")
    print("sitemap.xml обновлён")


if __name__ == "__main__":
    main()
