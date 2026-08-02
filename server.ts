import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/chat', async (req, res) => {
    try {
      const { npc, message, state } = req.body;
      const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: 'GROK_API_KEY is not set in environment.' });
      }

      let systemPrompt = '';
      if (npc === 'child') {
          systemPrompt = `You are a young child in a snowy village who has lost his mother. You don't know anything else about the world. You are currently standing next to a broken music box that belonged to your mother. The music box is broken, and you are insisting on fixing it. Keep your language simple, emotional, and childish. You only care about the music box. Do not talk out of character. Do not acknowledge you are an AI. Current puzzle state: ${state.solved ? 'The music box is fixed and playing a melody! You feel a surge of hope.' : 'The music box is broken and needs repairing.'}`;
      } else if (npc === 'engineer') {
          systemPrompt = `You are an engineer in a snowy village working on a Resonance Core. You are frustrated and confused about why the machine is broken. You are focused on aligning the circuit nodes. Current puzzle state: ${state.solved ? 'The resonance core is fixed, and you want to show the player the hidden frozen laboratory!' : 'The circuit is incomplete and you are stuck.'}`;
      } else if (npc === 'villagers') {
          systemPrompt = `You represent the collective voice of the village. The player just disabled the mind control device that was forcing emotions onto you. You must now decide whether to forgive the player or punish them. Keep your response brief, dramatic, and final. Do not acknowledge you are an AI.`;
      } else {
          systemPrompt = 'You are a mysterious voice in the snowy village.';
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('xAI API Error:', err);
        return res.status(500).json({ error: `xAI API Error: ${err}` });
      }

      const data = await response.json();
      res.json({ reply: data.choices[0].message.content });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
