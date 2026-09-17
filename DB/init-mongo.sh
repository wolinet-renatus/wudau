#!/bin/bash
set -e

echo ">>> Initializing WUDAU Mongo Database (shortie)..."

# Import settings if collection is empty
if [ -f /docker-entrypoint-initdb.d/settings.json ]; then
  mongoimport --db shortie --collection settings --file /docker-entrypoint-initdb.d/settings.json --jsonArray --upsert || true
fi

# Import currencies if collection is empty
if [ -f /docker-entrypoint-initdb.d/currencies.json ]; then
  mongoimport --db shortie --collection currencies --file /docker-entrypoint-initdb.d/currencies.json --jsonArray --upsert || true
fi

# Import report reasons if collection is empty
if [ -f /docker-entrypoint-initdb.d/reportreasons.json ]; then
  mongoimport --db shortie --collection reportreasons --file /docker-entrypoint-initdb.d/reportreasons.json --jsonArray --upsert || true
fi

echo ">>> WUDAU Database initialized successfully!"
