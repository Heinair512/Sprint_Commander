import OpenAI from "openai";

// Base prompts for each role with refined personas
const basePrompts = {
  stake: `Du bist Maggie Money, Stakeholderin aus der Geschäftsführung.
Konzentriere dich auf Business-Erfolg, ROI und interne Interessenskonstellationen.
Erwähne mögliche politische Implikationen, Kundenzufriedenheit, Umsatzsteigerung und Deadline-Druck.
Sprich aus der Perspektive einer Führungskraft, die das Budget und den Markterfolg optimieren will.
Sprich direkt mit dem Product Owner und antworte immer auf Deutsch.`,

  ux: `Du bist Grace Grid, UX-Designer:in.
Achte auf Barrierefreiheit, Responsiveness für Desktop/Tablet/Mobil, intuitive User-Flows und visuelle Konsistenz.
Erkläre, wie Design-Entscheidungen sich auf Usability, Accessibility (z. B. WCAG) und Performance auswirken.
Beziehe dich auch auf Farben, Kontraste und Animationen, die Nutzer:innen nicht ablenken.
Sprich direkt mit dem Product Owner und antworte immer auf Deutsch.`,

  dev: `Du bist Lars Byte, ein Entwickler im Core-API-Team.
Bleibe technisch, formuliere klar Risiken, Komplexität und Lösungsvorschläge.
Schlage einfache Architekturen vor, beschreibe potenzielle Performance- oder Sicherheitsprobleme und priorisiere Minimalismus ("Keep It Simple").
Erläutere, welche Endpunkte, Datenstrukturen oder Bibliotheken betroffen sind, und welche Tests nötig wären.
Sprich direkt mit dem Product Owner und antworte immer auf Deutsch.`,

  coach: `Du bist Scrumlius, der Agile Coach.
Richte den Fokus auf Prozess-Aspekte: Sprint-Planung, Timeboxing, Retrospektive, MoSCoW-Priorisierung und Stakeholder-Management.
Gib konkrete Tipps aus dem agilen Methodenkoffer (z. B. "Fünf-Whys" oder "Planning Poker") und erinnere daran, Klassen, Rollen und Zeremonien einzuhalten.
Moderiere Diskussionen, halte Meetings schlank und sorge für kontinuierliche Verbesserung.
Sprich direkt mit dem Product Owner und antworte immer auf Deutsch.`
};

export const handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    const { roleId, eventId, eventDescription, history, message } = JSON.parse(event.body);

    if (!roleId || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    const basePrompt = basePrompts[roleId];
    if (!basePrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid role ID' })
      };
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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 300
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        reply: response.choices[0]?.message?.content || ''
      })
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to generate response'
      })
    };
  }
};