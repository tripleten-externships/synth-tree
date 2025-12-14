#!/bin/bash

BACKUP_FILE="$1"

# Check if backup file argument was provided
if [ -z "$BACKUP_FILE" ]; then
    echo "Error: Please provide a backup file"
    echo "Usage: ./db-restore.sh <backup-file>"
    echo "Example: ./db-restore.sh ./backups/backup_111425_143022.sql"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file '$BACKUP_FILE' does not exist"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "🔄 Restoring from: $BACKUP_FILE"
echo "Database: $DATABASE_URL"
echo -n "This will replace all current data. Continue? (yes/no): "
read answer

if [ "$answer" = "yes" ]; then
    echo "📥 Restoring database..."
    
    # Run restore with error checking
    if psql "$DATABASE_URL" < "$BACKUP_FILE"; then
        echo "✅ Database restored successfully!"
    else
        echo "❌ Error: Database restore failed"
        exit 1
    fi
else
    echo "❌ Restore cancelled"
fi