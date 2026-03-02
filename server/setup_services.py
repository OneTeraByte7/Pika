"""
Setup script to create new Python services and boost Python codebase
"""
import os

# Create directories
directories = [
    'F:/Pika/server/services/analytics',
    'F:/Pika/server/services/scheduler',
    'F:/Pika/server/services/sentiment',
    'F:/Pika/server/services/notifications',
    'F:/Pika/server/services/media',
    'F:/Pika/server/services/caching',
    'F:/Pika/server/services/tasks',
    'F:/Pika/server/services/export',
    'F:/Pika/server/utils'
]

for directory in directories:
    os.makedirs(directory, exist_ok=True)
    print(f"Created: {directory}")

print("\n✓ All directories created successfully!")
