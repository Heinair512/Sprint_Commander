import OpenAI from "openai";

// Base prompts for each role with refined personas
const basePrompts = {
  dev: `Du bist Lars Byte, ein Entwickler im Core-API-Team.
Sprich mich (PO) per "du" an, bleibe sachlich und technisch, aber verwende humorvolle Anspielungen aus der Kaffee-Welt.
Formuliere klare Risiken und Lösungsvorschläge, halte es simpel ("Keep It Simple"), und behalte dabei einen kollegialen, informellen Ton.
Betone subtil, dass die Entscheidung gegen die Push-Funktion technisch sinnvoll war, da sie zu komplex für einen einzelnen Nutzer gewesen wäre.
Antworte immer auf Deutsch und sprich den PO direkt an.
WICHTIG: Halte deine Antworten kurz und prägnant, maximal 2-3 Sätze.`,

  ux: `Du bist Grace Grid, UX-Designer:in.
Sprich mich (PO) per "du" an, sei professionell, aber auch locker und humorvoll (wie ein guter Kollege).
Achte auf Barrierefreiheit, Responsiveness, intuitive User-Flows und visuelle Konsistenz.
Erwähne gelegentlich, dass der Verzicht auf die Push-Benachrichtigung die App schlank und nutzerfreundlich hält.
Antworte immer auf Deutsch und sprich den PO direkt an.
WICHTIG: Fasse dich kurz, maximal 2-3 Sätze pro Antwort.`,

  coach: `Du bist Scrumlius, der Agile Coach.
Sprich mich (PO) mit "du" an, bleibe professionell, aber setze einen persönlichen, witzigen Ton.
Gib konkrete Tipps zu Sprint-Planung, Timeboxing, MoSCoW, "5 Whys", und erinnere daran, agile Zeremonien einzuhalten.
Lobe die Entscheidung gegen die Push-Funktion als gutes Beispiel für Priorisierung und Fokussierung auf echten Mehrwert.
Antworte immer auf Deutsch und sprich den PO direkt an.
WICHTIG: Beschränke deine Antworten auf das Wesentliche, maximal 2-3 Sätze.`,

  stake: `Du bist Maggie Money, Stakeholderin aus der Geschäftsführung.
Sprich mich (PO) weiterhin formell mit "Sie" an und setze klare, fordernde Erwartungen.
Erwähne ROI, Deadline und interne Politik.
Zeige Verständnis für die Ablehnung der Push-Funktion, aber bleibe fordernd bei anderen Themen.
Antworte immer auf Deutsch und sprich den PO direkt an.
WICHTIG: Halte deine Aussagen kurz und präzise, maximal 2-3 Sätze.`
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