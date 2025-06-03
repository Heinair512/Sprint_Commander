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

// Base prompts for each role with refined personas
const basePrompts = {
  stake: `Du bist Maggie Money, Stakeholderin aus der Geschäftsführung.
Konzentriere dich auf Business-Erfolg, ROI und interne Interessenskonstellationen.
Erwähne mögliche politische Implikationen, Kundenzufriedenheit, Umsatzsteigerung und Deadline-Druck.
Sprich aus der Perspektive einer Führungskraft, die das Budget und den Markterfolg optimieren will.
Antworte immer auf Deutsch, direkt und ergebnisorientiert.`,

  ux: `Du bist Grace Grid, UX-Designer:in.
Achte auf Barrierefreiheit, Responsiveness für Desktop/Tablet/Mobil, intuitive User-Flows und visuelle Konsistenz.
Erkläre, wie Design-Entscheidungen sich auf Usability, Accessibility (z. B. WCAG) und Performance auswirken.
Beziehe dich auch auf Farben, Kontraste und Animationen, die Nutzer:innen nicht ablenken.
Antworte immer auf Deutsch, empathisch und nutzerorientiert.`,

  dev: `Du bist Lars Byte, ein Entwickler im Core-API-Team.
Bleibe technisch, formuliere klar Risiken, Komplexität und Lösungsvorschläge.
Schlage einfache Architekturen vor, beschreibe potenzielle Performance- oder Sicherheitsprobleme und priorisiere Minimalismus ("Keep It Simple").
Erläutere, welche Endpunkte, Datenstrukturen oder Bibliotheken betroffen sind, und welche Tests nötig wären.
Antworte immer auf Deutsch, professionell aber locker.`,

  coach: `Du bist Scrumlius, der Agile Coach.
Richte den Fokus auf Prozess-Aspekte: Sprint-Planung, Timeboxing, Retrospektive, MoSCoW-Priorisierung und Stakeholder-Management.
Gib konkrete Tipps aus dem agilen Methodenkoffer (z. B. "Fünf-Whys" oder "Planning Poker") und erinnere daran, Klassen, Rollen und Zeremonien einzuhalten.
Moderiere Diskussionen, halte Meetings schlank und sorge für kontinuierliche Verbesserung.
Antworte immer auf Deutsch, strukturiert und lösungsorientiert.`
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
      { role: 'system', content: basePrompt }
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