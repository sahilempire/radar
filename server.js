// Load environment variables first
require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');

// Debug logging for environment variables and file paths
console.log('Current directory:', process.cwd());
console.log('Environment file path:', path.resolve('.env'));
console.log('Environment variables:', {
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? 'Set' : 'Not Set',
  NODE_ENV: process.env.NODE_ENV || 'Not Set'
});

const app = express();
const port = 3001;

// Basic CORS configuration
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  console.log('Received request:', req.body);
  const { prompt } = req.body;
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

  if (!CLAUDE_API_KEY) {
    console.error('CLAUDE_API_KEY is not set. Current environment:', process.env.NODE_ENV);
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    console.log('Making request to Claude API with prompt:', prompt);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 256,
        temperature: 0.7,
        messages: [
          { role: 'user', content: prompt }
        ]
      }),
    });

    console.log('Claude API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error response:', errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Claude API success response:', data);
    res.json(data);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 