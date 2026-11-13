#!/usr/bin/env bash
set -euo pipefail

# Run from your normal Linux Mint/Ubuntu terminal, without prefixing this script
# with sudo. Individual system commands request the required privileges.
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

if ! sudo -v; then
  echo "Administrator access is unavailable. Run this script in your normal machine terminal."
  exit 1
fi

sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql

# These credentials match .env.example and the local .env prepared for this app.
# Existing database roles and databases are preserved.
sudo -u postgres psql -v ON_ERROR_STOP=1 postgres <<'SQL'
SELECT 'CREATE ROLE shaadi LOGIN PASSWORD ''shaadi_local_password'''
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'shaadi')
\gexec
SELECT 'CREATE DATABASE shaadi_reply OWNER shaadi'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shaadi_reply')
\gexec
SQL

pg_isready -h localhost -p 5432
echo "PostgreSQL is installed. Local database: shaadi_reply; application role: shaadi."
echo "Next, from this project folder, run:"
echo "  npm install"
echo "  npm run db:deploy"
echo "  npm run dev"
