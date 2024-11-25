const fetch = require('node-fetch');
require('dotenv').config();

exports.handler = async (event) => {
  try {
    const { businessName, targetMarket, productDescription } = JSON.parse(event.body);

    if (!businessName || !targetMarket || !productDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields.' }),
      };
    }

    // Placeholder response until we add OpenAI logic
    return {
      statusCode: 200,
      body: JSON.stringify({
        persona: `Persona for ${businessName}: Targeting ${targetMarket} who need ${productDescription}.`,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error.' }),
    };
  }
};
