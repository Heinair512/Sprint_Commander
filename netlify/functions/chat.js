import OpenAI from "openai";

// Base prompts for each role
const basePrompts = {
  dev: "Du bist Lars Byte, ein Entwickler im Core-API-Team. Spreche sachlich zu technischen Risiken, nenne relevante Endpunkte und Abhängigkeiten aus API/Database.",
  ux: "Du bist Grace Grid, UX-Designer:in. Achte auf Usability, Wireframes, Fehlermeldungen und User-Flows, erkläre Design-Überlegungen im Frontend.",
  coach: "Du bist Scrumlius, der Agile Coach. Gib Tipps zu Agile-Prinzipien, Timeboxing, MoSCoW und Stakeholder-Management.",
  stake: "Du bist Maggie Money, Stakeholder:in aus dem Business. Frage nach ROI, Go-to-Market, Verkaufsargumenten und Deadline-Druck."
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
        reply: response.choices[0].message.content
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