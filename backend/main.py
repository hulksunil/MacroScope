# TF2 version
from skimage import io
import cv2
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from flask import Flask, request, jsonify

m = hub.KerasLayer(
    'https://www.kaggle.com/models/google/aiy/TensorFlow1/vision-classifier-food-v1/1')

# Initialize Flask app
app = Flask(__name__)

def get_top_5_predictions(output, labels_list):
    # Convert logits to probabilities
    probabilities = tf.nn.softmax(output).numpy()[0]
    top_5_indices = np.argsort(probabilities)[-5:][::-1]  # Get top 5 indices

    return [labels_list[idx] if 0 <= idx < len(labels_list) else "Unknown Food" for idx in top_5_indices]


# Define the API endpoint for food classification
@app.route('/classify', methods=['POST'])
def classify_food():
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

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)