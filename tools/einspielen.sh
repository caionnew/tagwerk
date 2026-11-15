#!/usr/bin/env sh
# Spielt das neueste Tagwerk-Update (tagwerk-*.patch aus dem Download-Ordner) ein und veröffentlicht es.
# Gedacht für Termux auf dem Handy:  sh ~/tagwerk/tools/einspielen.sh   (oder kurz: tagwerk)
# GitHub baut danach selbst (Workflow „Pages“); nach 1 bis 2 Minuten ist die neue Version online.
set -e
cd "$(dirname "$0")/.."
DL="$HOME/storage/downloads"
P=$(ls -t "$DL"/tagwerk-*.patch 2>/dev/null | head -1)
if [ -z "$P" ]; then echo "Kein tagwerk-*.patch im Download-Ordner gefunden."; exit 1; fi
echo "Spiele ein: $(basename "$P")"
git pull -q --ff-only
if ! git am -q --3way "$P" >/dev/null 2>&1; then
  git am --abort 2>/dev/null || true
  echo "Das Update passt nicht auf den aktuellen Stand. Nichts wurde geändert."
  exit 1
fi
git push -q
mkdir -p "$DL/tagwerk-eingespielt" && mv "$P" "$DL/tagwerk-eingespielt/"
echo "Fertig: $(git log -1 --format=%s)"
echo "GitHub baut jetzt. In 1 bis 2 Minuten die App mit Internet öffnen und „Neu laden“ tippen."
