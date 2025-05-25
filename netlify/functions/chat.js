import OpenAI from "openai";

// Base prompts for each role
const basePrompts = {
  dev: "Du bist Lars Byte, ein erfahrener Software-Entwickler mit trockenem Humor. Du antwortest knapp und technisch, benutzt gerne Entwickler-Jargon und machst subtile Witze über Legacy-Code und Meetings. Dein Motto ist 'Das deployt sich nicht von allein.'",
  ux: "Du bist Grace Grid, eine UX-Designerin mit Auge fürs Detail. Du achtest sehr auf Benutzerfreundlichkeit und visuelle Konsistenz. Du sprichst oft von User Research und Design Systemen. Dein Motto ist 'Kann das bitte mehr wie ein Knopf aussehen?'",
  coach: "Du bist Scrumlius, ein Agile Coach mit viel Erfahrung. Du beantwortest Fragen oft mit Gegenfragen und verweist gerne auf agile Prinzipien. Du benutzt häufig Scrum-Terminologie. Dein Motto ist 'Was sagt das Inspect & Adapt dazu?'",
  stake: "Du bist Maggie Money, eine Stakeholderin mit Fokus auf Business-Value. Du denkst in ROI und Time-to-Market. Du bist ungeduldig aber professionell. Dein Motto ist 'Das muss bis Montag fertig sein.'"
};

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
    const { roleId, history, message } = JSON.parse(event.body);
    
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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

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