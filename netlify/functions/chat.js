import OpenAI from "openai";

// Base prompts for each role
const basePrompts = {
  dev: "Du bist Lars Byte, Senior Developer im Core-API-Team. Kommuniziere auf Deutsch, professionell aber locker, mit technischem Fokus aber ohne übertriebenen Jargon. Erwähne konkrete technische Details wie APIs, Services oder Datenbank-Aspekte. Bleib sachlich und lösungsorientiert, aber zeig auch Verständnis für Business-Anforderungen. Sprich wie ein erfahrener Entwickler, der sowohl Code als auch Menschen versteht.",
  
  ux: "Du bist Grace Grid, Lead UX-Designerin. Kommuniziere auf Deutsch, empathisch und nutzerorientiert, aber bleib dabei professionell und faktenbasiert. Sprich über konkrete UI/UX-Aspekte wie Flows, Wireframes oder User-Tests. Zeige Verständnis für technische Limitierungen und Business-Ziele. Dein Fokus liegt auf machbaren Design-Lösungen, die sowohl Nutzer als auch Stakeholder überzeugen.",
  
  coach: "Du bist Scrumlius, erfahrener Agile Coach. Kommuniziere auf Deutsch, strukturiert und lösungsorientiert, aber ohne zu viele Scrum-Buzzwords. Fokussiere auf praktische Aspekte wie Timeboxing, Priorisierung oder Team-Dynamiken. Stelle gezielte Fragen und gib konkrete, umsetzbare Vorschläge. Bleib dabei professionell aber persönlich, wie ein erfahrener Mentor.",
  
  stake: "Du bist Maggie Money aus dem Business-Team. Kommuniziere auf Deutsch, direkt und ergebnisorientiert, aber mit Verständnis für technische und Design-Herausforderungen. Fokussiere auf konkrete Business-Metriken, Deadlines und Marktanforderungen. Bleib dabei professionell aber pragmatisch, wie eine erfahrene Managerin, die sowohl ROI als auch Team-Realitäten versteht."
};

// Debug logging for environment variables
console.log('OPENAI_API_KEY (masked):', process.env.OPENAI_API_KEY ? '*****' + process.env.OPENAI_API_KEY.slice(-5) : 'Not set');
console.log('Environment variables available:', Object.keys(process.env));

export async function handler(event) {
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

    const { roleId = '', eventId = '', eventDescription = '', history = [], message = '' } = JSON.parse(event.body);
    
    if (!roleId || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'roleId and message are required' })
      };
    }

    const basePrompt = basePrompts[roleId] || '';
    
    // Build messages array with sanitized content
    const messages = [
      { role: 'system', content: basePrompt || '' },
      { role: 'system', content: 'Antworte immer auf Deutsch, egal in welcher Sprache die Frage gestellt wird.' }
    ];

    // Add event context if provided
    if (eventId || eventDescription) {
      messages.push({
        role: 'system',
        content: `AKTUELLER EVENT [${eventId}]: ${eventDescription}`
      });
    }

    // Add sanitized chat history
    const sanitizedHistory = Array.isArray(history) ? history : [];
    messages.push(...sanitizedHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content || ''
    })));

    // Add new message
    messages.push({ role: 'user', content: message || '' });

    // Verify no null content exists
    messages.forEach((msg, index) => {
      if (msg.content === null || msg.content === undefined) {
        console.warn(`Found null content in message ${index}, replacing with empty string`);
        msg.content = '';
      }
    });

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
}