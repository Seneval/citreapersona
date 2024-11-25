const fetch = require('node-fetch'); // For making API calls
require('dotenv').config(); // Load environment variables

exports.handler = async (event) => {
  try {
    // Parse the request body
    const { businessName, targetMarket, productDescription } = JSON.parse(event.body);

    // Validate input: All fields must be provided
    if (!businessName || !targetMarket || !productDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Todos los campos son obligatorios.' }), // Error in Spanish
      };
    }

    // OpenAI prompt in Spanish
    const prompt = `
Eres un experto en marketing y creación de User Personas. Con base en la información proporcionada, genera una User Persona en español que incluya:

1. Demografía (Nombre, edad, ocupación, ingresos, estado civil, situación familiar, ubicación).
2. Descripción del usuario (breve narrativa sobre su perfil y motivaciones).
3. Psicografía (características personales, intereses, aspiraciones, metas, dolencias, desafíos, necesidades, sueños).
4. Comportamientos de compra (presupuesto, frecuencia de compra, canales preferidos, comportamiento en línea, términos de búsqueda, marcas preferidas, desencadenantes, barreras).

Detalles:
- Nombre del negocio: ${businessName}
- Mercado objetivo: ${targetMarket}
- Descripción del producto o servicio: ${productDescription}
    `;

    // Make a request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Load the API key from .env
      },
      body: JSON.stringify({
        model: 'gpt-4', // Specify the OpenAI model
        messages: [{ role: 'user', content: prompt }], // Use the prompt
        max_tokens: 500, // Adjust max_tokens to control the response length
      }),
    });

    // Check if the OpenAI API response is okay
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData); // Log the error for debugging
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'No se pudo generar la persona. Inténtalo de nuevo más tarde.' }),
      };
    }

    // Parse the response from OpenAI
    const data = await response.json();
    const persona = data.choices[0].message.content; // Get the content of the generated message

    // Return the generated persona
    return {
      statusCode: 200,
      body: JSON.stringify({ persona }), // Return persona in the response
    };
  } catch (error) {
    // Catch any unexpected errors
    console.error('Server Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ocurrió un error inesperado.' }), // Generic server error in Spanish
    };
  }
};
