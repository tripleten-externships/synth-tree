#!/bin/bash
mkdir -p ./backups

TIMESTAMP=$(date '+%m%d%y')
pg_dump "$DATABASE_URL" > "./backups/backup_$TIMESTAMP.sql"

echo "Backup created: backup_$TIMESTAMP.sql"