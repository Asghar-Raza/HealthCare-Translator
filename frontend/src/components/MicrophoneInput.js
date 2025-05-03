import React, { useState, useRef, useEffect } from 'react';

function MicrophoneInput({ onStartRecording, onAudioCaptured, isRecording }) {
    // State to track if the user has granted microphone access
    const [isUserMediaAvailable, setIsUserMediaAvailable] = useState(false);
    // useRef to hold the MediaRecorder object
    const mediaRecorder = useRef(null);
    // useRef to store the chunks of audio data being recorded
    const audioChunks = useRef([]);
    // useRef to hold the audio stream
    const streamRef = useRef(null);

    // useEffect hook to handle microphone access and MediaRecorder setup
    useEffect(() => {
        // Request access to the user's microphone
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                // If access is granted, store the stream
                streamRef.current = stream;
                setIsUserMediaAvailable(true);
                // Create a new MediaRecorder instance with the audio stream
                mediaRecorder.current = new MediaRecorder(stream);

                // Event handler that is called when audio data is available
                mediaRecorder.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        // Add the audio data chunk to the array
                        audioChunks.current.push(event.data);
                    }
                };

                // Event handler that is called when recording is stopped
                mediaRecorder.current.onstop = () => {
                    // Create a Blob (Binary Large Object) from the audio chunks
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' }); // Adjust type as needed
                    // Clear the audio chunks array for the next recording
                    audioChunks.current = [];
                    // Call the onAudioCaptured prop passed from the parent component, passing the audio Blob
                    onAudioCaptured(audioBlob);
                };
            })
            .catch((error) => {
                // If microphone access is denied or an error occurs, log the error
                console.error('Error accessing microphone:', error);
                setIsUserMediaAvailable(false);
            });

        // Cleanup function that runs when the component unmounts or re-renders
        return () => {
            // If the MediaRecorder is recording, stop it
            if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                mediaRecorder.current.stop();
            }
            // If there's an active stream, stop all its tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [onAudioCaptured]); // Only re-run this effect if onAudioCaptured changes

    // Function to start recording
    const startRecording = () => {
        if (mediaRecorder.current && isUserMediaAvailable) {
            // Clear any previous audio chunks
            audioChunks.current = [];
            // Start the MediaRecorder
            mediaRecorder.current.start();
            // Call the onStartRecording prop passed from the parent component
            onStartRecording();
        } else if (!isUserMediaAvailable) {
            // Alert the user if microphone access hasn't been granted
            alert('Microphone access not granted.');
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            // Stop the MediaRecorder
            mediaRecorder.current.stop();
        }
    };

    return (
        <div>
            {/* Button to start recording */}
            <button onClick={startRecording} disabled={isRecording || !isUserMediaAvailable}>
                {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            {/* Button to stop recording */}
            <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
            {/* Display a message if microphone access is not granted */}
            {!isUserMediaAvailable && <p style={{ color: 'orange' }}>Please grant microphone access.</p>}
        </div>
    );
}

export default MicrophoneInput;