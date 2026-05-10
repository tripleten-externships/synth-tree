#!/bin/sh
# Production container entrypoint for the Synth Tree API.
#
# Responsibilities:
#   1. Compose a DATABASE_URL from individual env vars (the way ECS / Secrets
#      Manager hands them to us). URL-encode the username and password so a
#      password containing '@', '+', ':' etc. doesn't corrupt the URL.
#   2. Run pending Prisma migrations.
#   3. Exec the compiled Node app with tsconfig-paths so the "@graphql/*" and
#      "@lib/*" path aliases resolve against ./dist.
#
# This script lives in the repo (not generated inline in the Dockerfile) so
# changes are reviewable in a normal diff.
set -e

if [ -z "${DATABASE_USERNAME:-}" ] || [ -z "${DATABASE_PASSWORD:-}" ] || \
   [ -z "${DATABASE_HOST:-}" ] || [ -z "${DATABASE_PORT:-}" ] || \
   [ -z "${DATABASE_NAME:-}" ]; then
  echo "❌ Missing required env var: need DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME." >&2
  exit 1
fi

# URL-encode the username and password so RDS-generated secrets with special
# characters work in the connection string.
ENCODED_USERNAME=$(DB_USER="$DATABASE_USERNAME" node -e "process.stdout.write(encodeURIComponent(process.env.DB_USER))")
ENCODED_PASSWORD=$(DB_PASS="$DATABASE_PASSWORD" node -e "process.stdout.write(encodeURIComponent(process.env.DB_PASS))")

export DATABASE_URL="postgresql://${ENCODED_USERNAME}:${ENCODED_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

echo "Running database migrations..."
# `prisma` is in dependencies (not devDependencies), so node_modules/.bin/prisma
# is present in the production image and we can call it directly without npx.
./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma

echo "Starting application..."
export TS_NODE_PROJECT=./tsconfig.runtime.json
exec node -r tsconfig-paths/register dist/index.js
