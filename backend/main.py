# TF2 version
from datetime import datetime
from skimage import io
import cv2
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from flask import Flask, request, jsonify
from flask_cors import CORS

import google.generativeai as genai  # Gemini API
import os
from dotenv import load_dotenv  # Import dotenv to load environment variables

import PIL.Image

from mongo import create_user, get_daily_intake, get_user_targets, hash_password, read_user, upsert_daily_intake

# Load environment variables from .env file
load_dotenv()


m = hub.KerasLayer(
    'https://www.kaggle.com/models/google/aiy/TensorFlow1/vision-classifier-food-v1/1')

# Initialize Flask app
app = Flask(__name__)


# Enable CORS
CORS(app)


# Configure genai with API key
genai_api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
if genai_api_key:
    genai.configure(api_key=genai_api_key)
else:
    raise ValueError("Missing Gemini API Key. Please check your .env file.")


def get_top_5_predictions(output, labels_list):
    # Convert logits to probabilities
    probabilities = tf.nn.softmax(output).numpy()[0]
    top_5_indices = np.argsort(probabilities)[-5:][::-1]  # Get top 5 indices

    return [labels_list[idx] if 0 <= idx < len(labels_list) else "Unknown Food" for idx in top_5_indices]


# Function to get nutrition info using Gemini API
def get_nutrition_info(food_item):
    prompt = f"Provide estimate nutritional information for {food_item} shown in the image in JSON format with keys: calories, protein_g, fat_g, carbs_g, fiber_g. Do not include any other information at all and no mark down formatting! Example: {{\"calories\": 100, \"protein_g\": 10, \"fat_g\": 5, \"carbs_g\": 20, \"fiber_g\": 2}}"
    model = genai.GenerativeModel("gemini-1.5-pro")  # Use Gemini Pro Model

    # load the image (uses the same image as the food classification endpoint)
    myfile = PIL.Image.open("uploads/image.jpg")

    response = model.generate_content([myfile, "\n\n", prompt])
    try:
        # Ensure the response is a valid JSON string
        nutrition_info = response.text.strip()

        # Convert to dictionary (ensure the API returns JSON-like output)
        return eval(nutrition_info)
    except:
        return {"error": "Failed to parse response"}


# Define the API endpoint for food classification
@app.route('/classify', methods=['POST'])
def classify_food():
    print("Classifying food")
    # Get uploaded image from the request
    image_file = request.files.get('image')
    # image_file = "uploads/image.jpg"

    if not image_file:
        return jsonify({"error": "No image file provided"}), 400

    # Read the image
    image_path = "uploads/image.jpg"
    image_file.save(image_path)

    # Define the labelmap URL (adjust as needed)
    labelmap_url = "labels/labels.csv"
    input_shape = (224, 224)

    # Preprocess the image
    image = np.asarray(io.imread(image_path), dtype="float")
    image = cv2.resize(image, dsize=input_shape, interpolation=cv2.INTER_CUBIC)
    image = image / image.max()  # Normalize
    images = np.expand_dims(image, 0)

    # Run inference with the model
    output = m(images)

    # Get class names from CSV file
    classes = list(pd.read_csv(labelmap_url)["name"])

    # Get top 5 predictions
    predictions = get_top_5_predictions(output, classes)

    return jsonify({"top_5_predictions": predictions})


@app.route('/nutrition', methods=['POST'])
def get_nutrients():
    print("Getting nutrients")
    # Call the Gemini API to get the nutrients
    data = request.json
    food_item = data.get("food_item")  # Get food name from request
    email = data.get("email")

    if not food_item:
        return jsonify({"error": "No food item provided"}), 400

    if not email:
        return jsonify({"error": "Missing email"}), 400

    nutrition_info = get_nutrition_info(food_item)

    date_obj = datetime.utcnow()

    protein_consumed = nutrition_info.get("protein_g", 0)
    calories_consumed = nutrition_info.get("calories", 0)
    # update their daily intake
    upsert_daily_intake(email, calories_consumed, protein_consumed, date_obj)

    return jsonify({"food_item": food_item, "nutrition_info": nutrition_info})


def get_meal_suggestions(target_calories, target_protein):
    """Fetches meal suggestions based on target calorie & protein goals."""

    model = genai.GenerativeModel("gemini-1.5-pro")  # Use Gemini Pro Model

    prompt = (
        f"Suggest a list of meals to eat today that total around {target_calories} calories "
        f"and provide at least {target_protein}g of protein. "
        "Return a JSON format with an array 'meals' containing objects with 'name', 'calories', 'protein_g'. Do not include any other information at all and no mark down formatting! Example: {\"meals\": [{\"name\": \"Chicken Salad\", \"calories\": 300, \"protein_g\": 20}, {\"name\": \"Beef Stir Fry\", \"calories\": 400, \"protein_g\": 30}]}"
    )

    print(prompt)

    response = model.generate_content(prompt)

    try:
        meal_suggestions = response.text.strip()
        print(meal_suggestions)
        return eval(meal_suggestions)  # Convert to dictionary
    except:
        return {"error": "Failed to parse response"}


@app.route('/meal_suggestions', methods=['POST'])
def meal_suggestions():
    """API endpoint to suggest meals based on calorie & protein goals."""
    try:
        data = request.json
        email = data.get("email")

        if not email:
            return jsonify({"error": "Missing email"}), 400

        # find their daily calorie and protein goals
        user_targets = get_user_targets(email)
        target_calories = user_targets.get("calories")
        target_protein = user_targets.get("protein")

        if target_calories is None or target_protein is None:
            return jsonify({"error": "Missing target_calories or target_protein"}), 400

        date_obj = datetime.utcnow()

        daily_intake = get_daily_intake(email, date_obj)
        daily_calorie_intake = daily_intake.get("calories", 0)
        daily_protein_intake = daily_intake.get("protein", 0)

        remaining_calories = target_calories - daily_calorie_intake
        remaining_protein = target_protein - daily_protein_intake

        meal_data = get_meal_suggestions(remaining_calories, remaining_protein)
        return jsonify({
            "target_calories": target_calories,
            "target_protein": target_protein,
            "suggested_meals": meal_data.get("meals", [])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Endpoint for signing up a new user
@app.route('/signup', methods=['POST'])
def signup():
    # Get user details from request
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    height = data.get("height")
    weight = data.get("weight")
    dob = data.get("dob")
    calorie_goal = data.get("calorie_goal")
    protein_goal = data.get("protein_goal")

    if not (username and email and password and height and weight and dob and calorie_goal and protein_goal):
        return jsonify({"error": "Missing required fields"}), 400

    # Call the create_user function from mongo.py
    user_id = create_user(username, email, password, height,
                          weight, dob, calorie_goal, protein_goal)
    return jsonify({"user_id": user_id})

# Endpoint for logging in a user


@app.route('/login', methods=['POST'])
def login():
    # Get user details from request
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"error": "Missing email or password"}), 400

    # Call the read_user function from mongo.py
    user = read_user(email)

    if user and user.get("password") == hash_password(password):
        return jsonify({"message": "Login successful", "user": user})
    else:
        return jsonify({"error": "Invalid email or password"}), 401


if __name__ == '__main__':
    # Run the Flask app
    # app.run(host='0.0.0.0', port=5001, debug=True)
    app.run(debug=True)
