import os
from dotenv import load_dotenv

load_dotenv()

# Flask
SECRET_KEY = os.getenv("SECRET_KEY")

# Supabase / PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

# Cloudinary
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")