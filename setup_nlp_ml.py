#!/usr/bin/env python3
"""Setup script to create NLP/ML service directories and files."""

import os
import sys
from pathlib import Path

# Create base directories
base_path = Path("F:/Pika/server/services")
dirs_to_create = [
    base_path / "nlp",
    base_path / "ml_services",
    Path("F:/Pika/server/tests"),
]

for dir_path in dirs_to_create:
    dir_path.mkdir(parents=True, exist_ok=True)
    (dir_path / "__init__.py").touch()
    print(f"Created: {dir_path}")

print("Setup completed!")
