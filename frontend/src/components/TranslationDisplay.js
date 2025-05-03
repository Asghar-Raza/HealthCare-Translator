import React from 'react';

function TranslationDisplay({ originalText, translatedText }) {
    return (
        <div>
            <h2>Translation</h2>
            {/* Conditionally render the original text if it exists */}
            {originalText && (
                <div>
                    <strong>Original:</strong>
                    <p>{originalText}</p>
                </div>
            )}
            {/* Conditionally render the translated text if it exists */}
            {translatedText && (
                <div>
                    <strong>Translated:</strong>
                    <p>{translatedText}</p>
                </div>
            )}
            {/* Display a default message if neither original nor translated text is available */}
            {!originalText && !translatedText && <p>Speak to translate...</p>}
        </div>
    );
}

export default TranslationDisplay;