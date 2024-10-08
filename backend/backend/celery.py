from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the correct Django settings module for the 'celery' program.
environment = os.getenv('BUILD_MODE', 'development')  # Default to 'development' if unspecified
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'backend.settings.{environment}')

app = Celery('backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
