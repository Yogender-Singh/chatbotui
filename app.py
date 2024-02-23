import numpy as np
import whisper
import subprocess
import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = whisper.load_model("base.en")  # Load your desired Whisper model

os.makedirs("chatbot_audio_webm", exist_ok=True)
os.makedirs(
    "chatbot_audio_wav", exist_ok=True
)  # Create a temporary directory for the audio files


@app.route("/transcribe", methods=["POST", "GET"])
def transcribe():
    if "audio_file" not in request.files:
        return jsonify({"error": "Please provide an audio file."}), 400

    audio_file = request.files["audio_file"]

    # Create temporary files with unique names in the /temp directory
    with tempfile.NamedTemporaryFile(
        dir="chatbot_audio_webm", suffix=".webm", delete=False
    ) as temp_webm_file, tempfile.NamedTemporaryFile(
        dir="chatbot_audio_wav", suffix=".wav", delete=False
    ) as temp_wav_file:

        audio_file.save(temp_webm_file.name)

        # Convert to WAV format
        subprocess.run(["ffmpeg", "-i", temp_webm_file.name, temp_wav_file.name, "-y"])

        # Transcribe using Whisper
        result = model.transcribe(temp_wav_file.name)

        return jsonify({"text": result["text"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5317, use_reloader=False)
