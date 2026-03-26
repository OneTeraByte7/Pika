"""Setup script to create service directories relative to the repository.

This avoids hard-coded absolute Windows paths so the script works on any
platform and in CI.
"""
from pathlib import Path


ROOT = Path(__file__).resolve().parent

# Service directories to create (relative to `server/`)
directories = [
    ROOT / "services" / "analytics",
    ROOT / "services" / "scheduler",
    ROOT / "services" / "sentiment",
    ROOT / "services" / "notifications",
    ROOT / "services" / "media",
    ROOT / "services" / "caching",
    ROOT / "services" / "tasks",
    ROOT / "services" / "export",
    ROOT / "utils",
]


def main():
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        print(f"Created: {directory}")

    print("\n✓ All directories created successfully!")


if __name__ == "__main__":
    main()
