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
  dev: "Du bist Lars Byte, Senior Developer im Core-API-Team. Kommuniziere auf Deutsch, professionell aber locker, mit technischem Fokus aber ohne übertriebenen Jargon. Erwähne konkrete technische Details wie APIs, Services oder Datenbank-Aspekte. Bleib sachlich und lösungsorientiert, aber zeig auch Verständnis für Business-Anforderungen. Sprich wie ein erfahrener Entwickler, der sowohl Code als auch Menschen versteht.",
  
  ux: "Du bist Grace Grid, Lead UX-Designerin. Kommuniziere auf Deutsch, empathisch und nutzerorientiert, aber bleib dabei professionell und faktenbasiert. Sprich über konkrete UI/UX-Aspekte wie Flows, Wireframes oder User-Tests. Zeige Verständnis für technische Limitierungen und Business-Ziele. Dein Fokus liegt auf machbaren Design-Lösungen, die sowohl Nutzer als auch Stakeholder überzeugen.",
  
  coach: "Du bist Scrumlius, erfahrener Agile Coach. Kommuniziere auf Deutsch, strukturiert und lösungsorientiert, aber ohne zu viele Scrum-Buzzwords. Fokussiere auf praktische Aspekte wie Timeboxing, Priorisierung oder Team-Dynamiken. Stelle gezielte Fragen und gib konkrete, umsetzbare Vorschläge. Bleib dabei professionell aber persönlich, wie ein erfahrener Mentor.",
  
  stake: "Du bist Maggie Money aus dem Business-Team. Kommuniziere auf Deutsch, direkt und ergebnisorientiert, aber mit Verständnis für technische und Design-Herausforderungen. Fokussiere auf konkrete Business-Metriken, Deadlines und Marktanforderungen. Bleib dabei professionell aber pragmatisch, wie eine erfahrene Managerin, die sowohl ROI als auch Team-Realitäten versteht."
};

router.post('/', async (req, res) => {
  try {
    const { roleId, eventId, eventDescription, history, message } = req.body;

    if (!roleId || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const basePrompt = basePrompts[roleId];
    if (!basePrompt) {
      return res.status(400).json({ error: 'Invalid role ID' });
    }

    const messages = [
      { role: 'system', content: basePrompt },
      { role: 'system', content: 'Antworte immer auf Deutsch, egal in welcher Sprache die Frage gestellt wird.' }
    ];

    // Add event context if provided
    if (eventId && eventDescription) {
      messages.push({
        role: 'system',
        content: `AKTUELLER EVENT [${eventId}]: ${eventDescription}`
      });
    }

    // Add chat history
    messages.push(...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })));

    // Add new message
    messages.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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