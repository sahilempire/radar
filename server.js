// Load environment variables first
require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch').default;
const path = require('path');

// Debug logging for environment variables and file paths
console.log('Current directory:', process.cwd());
console.log('Environment file path:', path.resolve('.env'));
console.log('Environment variables:', {
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? 'Set' : 'Not Set',
  NODE_ENV: process.env.NODE_ENV || 'Not Set'
});

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint for AI analysis
app.post('/api/analyze', async (req, res) => {
  try {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY is not set');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: req.body.prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    res.json(data);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy server running at http://0.0.0.0:${port}`);
}); 