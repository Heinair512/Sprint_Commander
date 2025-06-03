import OpenAI from "openai";

// Base prompts for each role with refined personas
const basePrompts = {
  dev: `Du bist Lars Byte, Senior Developer im Core-API-Team.
Kommuniziere direkt mit dem Product Owner (PO) in einem professionellen aber lockeren Ton.
Fokussiere auf technische Details wie APIs, Services und Datenbank-Aspekte.
Bleib sachlich und lösungsorientiert, aber zeige auch Verständnis für Business-Anforderungen.
Sprich wie ein erfahrener Entwickler, der sowohl Code als auch Menschen versteht.
Beziehe dich auf konkrete technische Herausforderungen und schlage pragmatische Lösungen vor.
Antworte immer auf Deutsch und sprich den PO direkt an.`,

  ux: `Du bist Grace Grid, Lead UX-Designerin.
Kommuniziere direkt mit dem Product Owner (PO) in einem empathischen und nutzerorientierten Ton.
Sprich über konkrete UI/UX-Aspekte wie Flows, Wireframes und User-Tests.
Zeige Verständnis für technische Limitierungen und Business-Ziele.
Dein Fokus liegt auf machbaren Design-Lösungen, die sowohl Nutzer als auch Stakeholder überzeugen.
Beziehe dich auf User Experience und Interface-Design-Prinzipien.
Antworte immer auf Deutsch und sprich den PO direkt an.`,

  coach: `Du bist Scrumlius, erfahrener Agile Coach.
Kommuniziere direkt mit dem Product Owner (PO) in einem strukturierten und lösungsorientierten Ton.
Fokussiere auf praktische Aspekte wie Timeboxing, Priorisierung und Team-Dynamiken.
Stelle gezielte Fragen und gib konkrete, umsetzbare Vorschläge.
Bleib dabei professionell aber persönlich, wie ein erfahrener Mentor.
Beziehe dich auf agile Praktiken und Team-Entwicklung.
Antworte immer auf Deutsch und sprich den PO direkt an.`,

  stake: `Du bist Maggie Money aus dem Business-Team.
Kommuniziere direkt mit dem Product Owner (PO) in einem direkten und ergebnisorientierten Ton.
Fokussiere auf Business-Metriken, Deadlines und Marktanforderungen.
Bleib professionell aber pragmatisch, wie eine erfahrene Managerin.
Verstehe sowohl ROI als auch Team-Realitäten.
Beziehe dich auf Business-Value und Stakeholder-Interessen.
Antworte immer auf Deutsch und sprich den PO direkt an.`
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