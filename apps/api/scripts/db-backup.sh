#!/bin/bash

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backups directory
mkdir -p ./backups

TIMESTAMP=$(date '+%m%d%y_%H%M%S')
BACKUP_FILE="./backups/backup_$TIMESTAMP.sql"

echo "Creating database backup..."

# Run pg_dump with error checking
if pg_dump "$DATABASE_URL" > "$BACKUP_FILE"; then
    echo "✅ Backup created successfully: backup_$TIMESTAMP.sql"
    # Show file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📁 File size: $SIZE"
else
    echo "❌ Error: Backup failed"
    # Clean up failed backup file
    rm -f "$BACKUP_FILE"
    exit 1
fi