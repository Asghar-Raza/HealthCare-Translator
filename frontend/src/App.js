import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';
import MicrophoneInput from './components/MicrophoneInput';
import TranslationDisplay from './components/TranslationDisplay';
import api from './services/api';

function App() {
    // State variables to manage the application's data and UI state
    const [sourceLanguage, setSourceLanguage] = useState('en-US'); // Default source language (currently not used in the backend mock)
    const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language
    const [isRecording, setIsRecording] = useState(false); // Tracks whether the microphone is currently recording
    const [audioData, setAudioData] = useState(null); // Stores the captured audio data (as a Blob)
    const [originalText, setOriginalText] = useState(''); // Stores the transcribed text from the backend
    const [translatedText, setTranslatedText] = useState(''); // Stores the translated text from the backend
    const [error, setError] = useState(''); // Stores any error messages to display to the user
    const [isLoading, setIsLoading] = useState(false); // Tracks whether a translation request is in progress

    // Function to handle changes in the target language selection
    const handleTargetLanguageChange = (language) => {
        setTargetLanguage(language);
    };

    // Function called when audio is captured by the MicrophoneInput component
    const handleAudioCaptured = (audioBlob) => {
        setAudioData(audioBlob); // Store the captured audio Blob
        setIsRecording(false); // Update recording state
        sendAudioForTranslation(audioBlob); // Call the function to send the audio to the backend
    };

    // Function called when the user starts recording
    const handleRecordingStart = () => {
        setOriginalText(''); // Clear previous original text
        setTranslatedText(''); // Clear previous translated text
        setError(''); // Clear any previous errors
        setIsLoading(true); // Set loading state to true
        setIsRecording(true); // Update recording state
    };

    // Async function to send the captured audio to the backend for translation
    const sendAudioForTranslation = async (audioBlob) => {
        if (!audioBlob) {
            setError('No audio captured.');
            setIsLoading(false);
            return;
        }

        // Create a FormData object to send the audio file and target language
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.wav'); // Append the audio Blob with a filename
        formData.append('target_language', targetLanguage); // Append the target language

        try {
            // Use the api service (from src/services/api.js) to make a POST request
            const response = await api.post('/translate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type for sending files
                },
            });
            // If the request is successful, update the state with the received data
            setOriginalText(response.data.original_text);
            setTranslatedText(response.data.translated_text);
            setIsLoading(false); // Reset loading state
        } catch (err) {
            // If an error occurs during the API call, log the error and update the error state
            console.error('Error sending audio for translation:', err);
            setError('Failed to translate. Please try again.');
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <h1>HealthCare Translator</h1>
            {/* LanguageSelector component for choosing the target language */}
            <LanguageSelector label="Target Language" onChange={handleTargetLanguageChange} />
            {/* MicrophoneInput component for handling audio recording */}
            <MicrophoneInput
                onStartRecording={handleRecordingStart}
                onAudioCaptured={handleAudioCaptured}
                isRecording={isRecording}
            />
            {/* Display any error messages */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Display a loading message while translation is in progress */}
            {isLoading && <p>Translating...</p>}
            {/* TranslationDisplay component to show the original and translated text */}
            <TranslationDisplay originalText={originalText} translatedText={translatedText} />
        </div>
    );
}

export default App;