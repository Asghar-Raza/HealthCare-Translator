from flask import Flask, request, jsonify
from flask_cors import CORS
import time  # For simulating processing

# Initialize the Flask application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) to allow the frontend
# running on a different port to communicate with the backend.
CORS(app)

# --- Mock Speech-to-Text Service ---
class MockSpeechToTextService:
    def transcribe_audio(self, audio_file_path):
        """
        This is a mock function that simulates the process of transcribing
        audio from a file. In a real application, this would involve using
        a speech-to-text library or API.

        Args:
            audio_file_path (str): The path to the audio file.

        Returns:
            str: The mock transcribed text.
        """
        print(f"Mock Speech-to-Text: Processing audio from {audio_file_path}")
        time.sleep(2)  # Simulate a 2-second processing time
        return "This is the transcribed text from the audio."

# --- Mock Translation Service ---
class MockTranslationService:
    def translate_text(self, text, target_language):
        """
        This is a mock function that simulates translating text to a target
        language. In a real application, this would involve using a
        translation library or API.

        Args:
            text (str): The text to be translated.
            target_language (str): The target language code (e.g., 'es' for Spanish).

        Returns:
            str: The mock translated text.
        """
        print(f"Mock Translation: Translating '{text}' to '{target_language}'")
        time.sleep(1) # Simulate a 1-second processing time
        return f"This is the translated text in {target_language}."

# Create instances of our mock services
speech_service = MockSpeechToTextService()
translation_service = MockTranslationService()

# --- API Endpoint for Translation ---
@app.route('/translate', methods=['POST'])
def translate():
    """
    This is the API endpoint that the frontend will call to send audio
    for transcription and translation. It expects a POST request with
    an 'audio' file and a 'target_language' form parameter.
    """
    # Check if the 'audio' file and 'target_language' are present in the request
    if 'audio' not in request.files or 'target_language' not in request.form:
        # If either is missing, return a JSON error response with a 400 status code (Bad Request)
        return jsonify({'error': 'Missing audio file or target language'}), 400

    # Get the audio file from the request
    audio_file = request.files['audio']
    # Get the target language from the form data
    target_language = request.form['target_language']

    # Save the audio file temporarily on the server
    # In a real application, you might process the audio directly from memory
    temp_audio_path = "temp_audio.wav"
    try:
        audio_file.save(temp_audio_path)
        # Use the mock speech-to-text service to transcribe the audio
        transcribed_text = speech_service.transcribe_audio(temp_audio_path)
        # Use the mock translation service to translate the transcribed text
        translated_text = translation_service.translate_text(transcribed_text, target_language)
        # Clean up the temporary audio file
        import os
        os.remove(temp_audio_path)
        # Return the original and translated text as a JSON response with a 200 status code (OK)
        return jsonify({'original_text': transcribed_text, 'translated_text': translated_text})
    except Exception as e:
        # If any error occurs during processing, log the error and return a JSON error response
        import os
        os.remove(temp_audio_path) if os.path.exists(temp_audio_path) else None
        print(f"Error processing audio: {e}")
        return jsonify({'error': f'Error processing audio: {str(e)}'}), 500

# Run the Flask development server if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)