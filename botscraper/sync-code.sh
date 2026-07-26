#!/usr/bin/env bash
# Aggiorna il codice pubblicato sulla pagina /botscraper con l'ultima build.
#
# Da rilanciare ogni volta che ricompili BotScraper (`npm run build`),
# altrimenti la pagina continua a servire la versione vecchia.
#
#   ./botscraper/sync-code.sh [percorso-repo-botscraper]

set -euo pipefail

SRC="${1:-$HOME/botscraper}/dist"
DEST="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/code"

if [[ ! -d "$SRC" ]]; then
  echo "Bundle non trovati in $SRC — hai lanciato 'npm run build'?" >&2
  exit 1
fi

copy() {
  local from="$SRC/$1" to="$DEST/$2"
  if [[ ! -f "$from" ]]; then
    echo "manca $from" >&2
    exit 1
  fi
  cp "$from" "$to"
  printf '  %-16s %6s KB\n' "$2" "$(( ($(stat -c%s "$to") + 1023) / 1024 ))"
}

mkdir -p "$DEST"
echo "Aggiorno da $SRC:"
copy dist.js     botscraper.js
copy comments.js comments.js
copy monitor.js  monitor.js

if grep -rqi kura "$DEST"; then
  echo "ATTENZIONE: i bundle contengono ancora riferimenti a kura." >&2
  exit 1
fi

echo "Fatto. Ricordati di committare $DEST."
