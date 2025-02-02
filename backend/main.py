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




# cake_url = "https://storage.googleapis.com/tfhub-visualizers/google/aiy/vision/classifier/food_V1/1/image_1.jpg"
# labelmap_url = "https://www.gstatic.com/aihub/tfhub/labelmaps/aiy_food_V1_labelmap.csv"
cake_url = "uploads/image.jpg"
labelmap_url = "labels/labels.csv"

input_shape = (224, 224)

image = np.asarray(io.imread(cake_url), dtype="float")
image = cv2.resize(image, dsize=input_shape, interpolation=cv2.INTER_CUBIC)
# Scale values to [0, 1].
image = image / image.max()
# The model expects an input of (?, 224, 224, 3).
images = np.expand_dims(image, 0)
# This assumes you're using TF2.
output = m(images)

classes = list(pd.read_csv(labelmap_url)["name"])

probabilities = tf.nn.softmax(output).numpy()[0]  # Convert to 1D array

# Get indices of top 5 predictions
top_5_indices = np.argsort(probabilities)[-5:][::-1]  # Sort and reverse

# Print top 5 predictions
res = get_top_5_predictions(output, classes)
print(res)
