import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { answers } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Generate a career roadmap for: ${JSON.stringify(answers)}` }],
      model: "gpt-3.5-turbo",
    });
    res.json({ roadmap: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 AI Server running at http://localhost:${PORT}`));