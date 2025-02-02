from pymongo import MongoClient
from dotenv import load_dotenv

from datetime import datetime
from bson.objectid import ObjectId
import bcrypt

import os

# Load environment variables from .env file
load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["my_database"]
users_collection = db["users"]
intake_collection = db["daily_intake"]

# Ensure email is unique
users_collection.create_index("email", unique=True)

# Ensure index on email for fast lookups
intake_collection.create_index([("email", 1), ("date", 1)], unique=True)

# Helper function to hash passwords


def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Helper function to verify passwords


def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

# Create a new user


def create_user(username, email, password, height, weight, age, protein_goal, calorie_goal):
    user_document = {
        "username": username,
        "email": email,
        "password": hash_password(password),
        "height": height,
        "weight": weight,
        "age": age,  # Store as datetime object
        "targets": {
            "protein": protein_goal,
            "calories": calorie_goal
        },
    }
    try:
        result = users_collection.insert_one(user_document)
        return str(result.inserted_id)
    except Exception as e:
        return f"Error: {str(e)}"  # Handles duplicate email errors

# Read a user by email


def read_user(email):
    # Exclude password for security
    user = users_collection.find_one({"email": email}, {"password": 0})
    return user if user else None

# Update a user's details


def update_user(email, updated_fields):
    if "password" in updated_fields:
        updated_fields["password"] = hash_password(
            updated_fields["password"])  # Hash new password
    result = users_collection.update_one(
        {"email": email},
        {"$set": updated_fields}
    )
    return result.modified_count > 0  # Returns True if update was successful

# Delete a user by email


def delete_user(email):
    result = users_collection.delete_one({"email": email})
    return result.deleted_count > 0  # Returns True if delete was successful

# Read all users (excluding passwords)


def read_all_users():
    return list(users_collection.find({}, {"password": 0}))


def get_user_targets(email):
    user = users_collection.find_one(
        {"email": email},  # Filter by email
        # Projection: Include only "targets", exclude "_id"
        {"_id": 0, "targets": 1}
    )
    return user.get("targets") if user else None


def upsert_daily_intake(email, calories, protein, date_obj):
    """
    Inserts or updates a user's daily intake record.
    If a record exists for the given email and date, it adds to the existing values.
    Otherwise, it creates a new entry.
    """

    # Ensure the date has no time component (set time to midnight UTC)
    date_obj = datetime(date_obj.year, date_obj.month, date_obj.day)

    # Check if the user already has a daily intake record for the specified date
    existing_record = intake_collection.find_one(
        {"email": email, "date": date_obj})

    if existing_record:
        # Update existing record by adding new intake values
        updated_calories = existing_record.get(
            "calories_consumed", 0) + calories
        updated_protein = existing_record.get("protein_consumed", 0) + protein

        result = intake_collection.update_one(
            {"email": email, "date": date_obj},
            {"$set": {"calories_consumed": updated_calories,
                      "protein_consumed": updated_protein}}
        )
        return "Updated"
    else:
        # Create a new record if it doesn't exist
        result = intake_collection.insert_one({
            "email": email,
            "date": date_obj,
            "calories_consumed": calories,
            "protein_consumed": protein
        })
        return "Created"


def get_daily_intake(email, date_obj):
    date_obj = datetime(date_obj.year, date_obj.month, date_obj.day)

    record = intake_collection.find_one(
        {"email": email, "date": date_obj},
        {"_id": 0}  # Exclude _id
    )
    return record if record else None


# Example Usage
if __name__ == "__main__":
    # Create User
    user_id = create_user("john_doe", "johndoe@example.com", "securepassword123",
                          175, 70, 22, 150, 2000)
    print(f"Created User ID: {user_id}")

    # Read User
    # user = read_user("johndoe@example.com")
    # print("User Data:", user)

    # Update User
    # success = update_user("johndoe@example.com",
    #                       {"weight": 72, "password": "newsecurepassword"})
    # print("Update Successful:", success)

    # Read All Users
    # print("All Users:", read_all_users())

    # Delete User
    # deleted = delete_user("johndoe@example.com")
    # print("User Deleted:", deleted)

    # Example Usage
    email = "johndoe@example.com"
    targets = get_user_targets(email)
    print("User Targets:", targets)

    upsert_daily_intake(email, 1800, 100, "2021-10-01")
    intake = get_daily_intake(email, "2021-10-01")
    print(intake)
