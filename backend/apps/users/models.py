from django.db import models


class User(models.Model):
    telegram_id = models.BigIntegerField(unique=True, db_index=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)  # For admin password
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_admin = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    games_played = models.IntegerField(default=0)
    total_wagered = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_won = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_lost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return f"@{self.username or self.telegram_id}"


class Withdrawal(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    points = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_details = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'withdrawals'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.points} pts - {self.status}"
