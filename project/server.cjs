const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5001;

const ADK_SERVICE_URL = process.env.ADK_SERVICE_URL || 'http://localhost:8008';

app.use(cors());
app.use(express.json());

app.post('/api/adk-chat', async (req, res) => {
  console.log('Received /api/adk-chat request');
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided.' });
    }

    const response = await axios.post(`${ADK_SERVICE_URL}/invoke_agent`, {
      prompt: prompt,
    });

    res.json(response.data);
  } catch (error) {
    console.error('ADK service error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to get response from ADK service.' });
  }
});

app.post('/api/chat', async (req, res) => {
  console.log('Received /api/chat request');
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'No message provided.' });
    }

    // Prepare OpenRouter API request
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant for this project.' },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices?.[0]?.message?.content || 'No response from AI.';
    res.json({ message: aiMessage });
  } catch (error) {
    console.error('AI chat error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`AI chat server (OpenRouter) listening on port ${PORT}`);
}); 