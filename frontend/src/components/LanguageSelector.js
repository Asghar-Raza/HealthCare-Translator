import React from 'react';

function LanguageSelector({ label, onChange }) {
    // An array of language objects, each with a code and a name
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        // You can add more languages here
    ];

    return (
        <div>
            {/* Label for the dropdown */}
            <label htmlFor="targetLanguage">{label}: </label>
            {/* Dropdown (select) element */}
            <select id="targetLanguage" onChange={(e) => onChange(e.target.value)}>
                {/* Map through the languages array to create the options */}
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;