const fetch = require('node-fetch'); // Required for API calls
require('dotenv').config(); // Load environment variables from .env

exports.handler = async (event) => {
  try {
    // Parse input from the request body
    const { businessName, targetMarket, productDescription } = JSON.parse(event.body);

    // Validate input
    if (!businessName || !targetMarket || !productDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required.' }),
      };
    }

    // Construct the prompt for OpenAI
    const prompt = `
You are a marketing expert. Create a concise marketing persona for the following details:
Business Name: ${businessName}
Target Market: ${targetMarket}
Product/Service Description: ${productDescription}

Include:
1. The persona's name and role.
2. Key motivations and pain points.
3. Reasons to buy this product/service.
4. Key triggers for purchasing.
5. Best ways to reach them (online and offline).
    `;

    // Send a request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // Specify the GPT model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300, // Adjust based on the desired response length
      }),
    });

    // Handle OpenAI API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to generate persona. Please try again later.' }),
      };
    }

    const data = await response.json();
    const persona = data.choices[0].message.content;

    // Return the generated persona
    return {
      statusCode: 200,
      body: JSON.stringify({ persona }),
    };
  } catch (error) {
    console.error('Server Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An unexpected error occurred.' }),
    };
  }
};
