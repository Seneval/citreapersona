const fetch = require('node-fetch'); // Para llamadas a la API
require('dotenv').config(); // Para cargar las variables de entorno

exports.handler = async (event) => {
  try {
    const { businessName, targetMarket, productDescription } = JSON.parse(event.body);

    if (!businessName || !targetMarket || !productDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Todos los campos son obligatorios.' }),
      };
    }

    // Prompt actualizado para incluir todos los elementos indicados
    const prompt = `
Eres un experto en marketing y creación de User Personas. Basándote en la información proporcionada, genera una User Persona en español que incluya:

1. Demografía:
   - Nombre
   - Edad
   - Puesto

2. Psicografía:
   - Características personales (orientación profesional, valores, actitudes)
   - Metas profesionales
   - Dolencias (retos o problemas principales)
   - Necesidades
   - Principales desafíos

3. Comportamientos de Compra:
   - Catalizadores de compra (motivos clave para tomar una decisión de compra)
   - Frecuencia de compra
   - Canales preferidos (dónde prefiere buscar soluciones)
   - Cómo alcanzarlo online
   - Cómo alcanzarlo offline
   - Barreras para comprar (factores que dificultan la compra)

Detalles proporcionados:
- Nombre del negocio: ${businessName}
- Mercado objetivo: ${targetMarket}
- Descripción del producto o servicio: ${productDescription}
    `;

    // Llamada a la API de OpenAI con el modelo gpt-3.5-turbo
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Clave API desde .env
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Modelo más rápido y eficiente
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800, // Ajustado para respuestas más detalladas
        temperature: 0.7, // Creatividad balanceada
      }),
    });

    // Verificar si la respuesta de OpenAI fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en la API de OpenAI:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'No se pudo generar la persona. Inténtalo de nuevo más tarde.' }),
      };
    }

    const data = await response.json();
    const persona = data.choices[0].message.content; // Contenido generado por OpenAI

    // Retornar la respuesta generada
    return {
      statusCode: 200,
      body: JSON.stringify({ persona }),
    };
  } catch (error) {
    // Manejo detallado de errores
    console.error('Error en el servidor:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ocurrió un error inesperado en el servidor.' }),
    };
  }
};
