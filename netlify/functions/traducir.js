const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Método no permitido' };

  try {
    const { texto, idiomaDestino } = JSON.parse(event.body);
    
    // Inicializa con la variable de entorno segura de Netlify
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Traduce el siguiente texto al ${idiomaDestino}: "${texto}"`,
      config: {
        systemInstruction: "Eres un traductor profesional. Traduce el texto de forma natural. Devuelve ÚNICAMENTE la traducción limpia, sin comentarios.",
        temperature: 0.3,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ traduccion: response.text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};