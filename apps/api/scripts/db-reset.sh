#!/bin/bash

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "⚠️  This will DELETE ALL DATA in your database!"
echo "Database: $DATABASE_URL"
echo -n "Are you sure? (yes/no): "
read answer

if [ "$answer" = "yes" ]; then
    echo "🔄 Resetting database..."
    
    # Run Prisma reset with error checking
    if npx prisma db push --force-reset; then
        echo "✅ Database reset complete"
    else
        echo "❌ Error: Database reset failed"
        exit 1
    fi
else
    echo "❌ Reset cancelled"
fi
