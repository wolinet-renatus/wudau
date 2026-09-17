#!/bin/bash
set -e

echo ">>> Initializing WUDAU Mongo Database (shortie)..."

COLLECTIONS=(
  "settings"
  "currencies"
  "reportreasons"
  "songcategories"
  "songs"
  "hashtags"
  "users"
  "videos"
  "posts"
  "postorvideocomments"
  "likehistoryofpostorvideos"
  "followerfollowings"
  "banners"
)

for col in "${COLLECTIONS[@]}"; do
  file="/docker-entrypoint-initdb.d/${col}.json"
  if [ -f "$file" ]; then
    echo "    Importing collection: ${col}..."
    mongoimport --db shortie --collection "$col" --file "$file" --jsonArray --upsert || true
  fi
done

echo ">>> WUDAU Database initialized successfully with all demo content & migrations!"
