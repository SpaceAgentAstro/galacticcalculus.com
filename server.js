// server.js

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests

// Check if the OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set in the environment variables.');
    process.exit(1);
}

// Endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Input validation
    if (!userMessage || typeof userMessage !== 'string') {
        return res.status(400).json({ error: 'Invalid input: message is required and must be a string.' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // Return a structured response
        res.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.message);
        // Check if the error response exists and return it
        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                error: error.response.data,
            });
        }
        res.status(500).json({
            success: false,
            error: 'Error communicating with OpenAI API',
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});