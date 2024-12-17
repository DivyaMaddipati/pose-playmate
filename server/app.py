from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import time
import os

app = Flask(__name__)
CORS(app)

# Initialize Mediapipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Load dataset
dataset = pd.read_csv("yoga_poses_dataset.csv")

# Add route to serve video files
@app.route('/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory('videos', filename)

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(np.degrees(radians))
    
    if angle > 180.0:
        angle = 360 - angle
    
    return angle

@app.route('/validate-pose', methods=['POST'])
def validate_pose():
    try:
        # Get frame data from request
        frame_data = request.json['frame']
        selected_pose = request.json['pose']
        
        # Process frame and get angles
        # This is where you'll implement your pose detection logic
        
        # Return validation results
        return jsonify({
            'isCorrect': True,  # Replace with actual validation
            'feedback': ['Good posture'],  # Replace with actual feedback
            'confidence': 0.95  # Replace with actual confidence score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)