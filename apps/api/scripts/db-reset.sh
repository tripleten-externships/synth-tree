echo " This will DELETE ALL DATA in your database!"
echo -n "Are you sure? (yes/no): "
read answer


if [ "$answer" = "yes" ]; then
echo " Resetting database..."
npx prisma db push --force-reset
echo "Database reset complete"
else
echo "Reset cancelled"

fi