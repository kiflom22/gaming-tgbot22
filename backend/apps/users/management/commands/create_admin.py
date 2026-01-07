from django.core.management.base import BaseCommand
from apps.users.models import User


class Command(BaseCommand):
    help = 'Create admin user'

    def handle(self, *args, **options):
        # Check if admin already exists
        if User.objects.filter(username='admin').exists():
            self.stdout.write(self.style.WARNING('Admin user already exists!'))
            admin = User.objects.get(username='admin')
            admin.is_admin = True
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'Updated admin status for: {admin.username}'))
            return

        # Create admin user
        admin = User.objects.create(
            telegram_id=999999999,
            username='admin',
            first_name='Admin',
            last_name='User',
            is_admin=True,
            balance=1000000  # Start with 1M points
        )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created admin user: {admin.username}'))
        self.stdout.write(self.style.SUCCESS(f'Admin ID: {admin.id}'))
        self.stdout.write(self.style.SUCCESS(f'Balance: {admin.balance}'))
