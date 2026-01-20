import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import 'dotenv/config';

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 2. INITIALIZE GROQ (Using OpenAI Library) ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, 
  baseURL: "https://api.groq.com/openai/v1" 
});

// --- 3. THE API ENDPOINT ---
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ success: false, error: "No quiz answers provided" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional career mentor. Provide a detailed, step-by-step career roadmap. Return only valid JSON with 'title' and 'steps' keys."
        },
        {
          role: "user",
          content: `Generate a career roadmap based on these results: ${JSON.stringify(answers)}`
        }
      ],
      model: "llama-3.3-70b-versatile",
    });

    const roadmapData = completion.choices[0].message.content;
    res.json({ success: true, roadmap: roadmapData });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "AI Generation failed",
      details: error.message 
    });
  }
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});