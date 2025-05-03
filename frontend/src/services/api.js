import axios from 'axios';

// Define the base URL of the backend API
const baseURL = 'http://localhost:5000'; // Adjust if your backend runs on a different port

// Create an Axios instance with the base URL configured
const api = axios.create({
    baseURL: baseURL,
});

// Export the Axios instance so it can be used to make API calls
export default api;