
BACKUP_FILE="$1"


echo "Restoring from: $BACKUP_FILE"
psql "$DATABASE_URL" < "$BACKUP_FILE"
echo "Done!"