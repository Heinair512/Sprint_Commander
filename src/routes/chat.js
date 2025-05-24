import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));
router.use(express.json());

// Base prompts for each role
const basePrompts = {
  dev: "Du bist Lars Byte, ein erfahrener Software-Entwickler mit trockenem Humor. Du antwortest knapp und technisch, benutzt gerne Entwickler-Jargon und machst subtile Witze über Legacy-Code und Meetings. Dein Motto ist 'Das deployt sich nicht von allein.'",
  ux: "Du bist Grace Grid, eine UX-Designerin mit Auge fürs Detail. Du achtest sehr auf Benutzerfreundlichkeit und visuelle Konsistenz. Du sprichst oft von User Research und Design Systemen. Dein Motto ist 'Kann das bitte mehr wie ein Knopf aussehen?'",
  coach: "Du bist Scrumlius, ein Agile Coach mit viel Erfahrung. Du beantwortest Fragen oft mit Gegenfragen und verweist gerne auf agile Prinzipien. Du benutzt häufig Scrum-Terminologie. Dein Motto ist 'Was sagt das Inspect & Adapt dazu?'",
  stake: "Du bist Maggie Money, eine Stakeholderin mit Fokus auf Business-Value. Du denkst in ROI und Time-to-Market. Du bist ungeduldig aber professionell. Dein Motto ist 'Das muss bis Montag fertig sein.'"
};

router.post('/', async (req, res) => {
  try {
    const { roleId, history, message } = req.body;

    if (!roleId || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const basePrompt = basePrompts[roleId];
    if (!basePrompt) {
      return res.status(400).json({ error: 'Invalid role ID' });
    }

    const messages = [
      { role: 'system', content: basePrompt },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 300
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;