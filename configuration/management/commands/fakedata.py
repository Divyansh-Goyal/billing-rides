from django.core.management.base import BaseCommand
from faker import Faker
from configuration.models import Configuration
from django.utils import timezone

class Command(BaseCommand):
    help = 'Adding fake data for importing'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Number of records')

    def handle(self, *args, **options):
        fake = Faker()
        count = options['count']

        for _ in range(count):
            day = fake.day_of_week()
            distance_base_price = fake.random_int(min=500, max=2000) / 100.0
            distance_base_km = fake.random_int(min=100, max=500) / 100.0
            distance_additional_price = fake.random_int(min=100, max=500) / 100.0
            time_multiplier_factor = fake.random_int(min=100, max=200) / 100.0
            waiting_charge = fake.random_int(min=50, max=200) / 100.0
            base_waiting_time = fake.random_int(min=50, max=150) / 100.0
            
            Configuration.objects.create(
                day=day,
                distance_base_price=distance_base_price,
                distance_base_km=distance_base_km,
                distance_additional_price=distance_additional_price,
                time_multiplier_factor=time_multiplier_factor,
                waiting_charge=waiting_charge,
                base_waiting_time=base_waiting_time,
                created_at=timezone.now()
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully added {count} dummy records'))
