const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  const { prompt } = req.body;
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

  try {
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

    if (!response.ok) {
      throw new Error('Claude API error');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to call Claude API' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 