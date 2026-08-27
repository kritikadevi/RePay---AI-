from dotenv import load_dotenv
import os
import certifi

from pymongo import MongoClient
from pymongo.server_api import ServerApi


load_dotenv()


# ==========================================
# GET MONGODB URI
# ==========================================

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        "MONGO_URI is not found in the .env file"
    )


# ==========================================
# CONNECT TO MONGODB
# ==========================================

try:
    client = MongoClient(
        MONGO_URI,
        server_api=ServerApi("1"),
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000,
        socketTimeoutMS=30000
    )

    # Test connection
    client.admin.command("ping")

    print("MongoDB connected successfully!")

except Exception as e:

    print("MongoDB connection failed!")
    print(f"Error: {e}")

    raise


# ==========================================
# DATABASE
# ==========================================

db = client["repay_db"]


# ==========================================
# COLLECTION
# ==========================================

payments_collection = db["payments"]