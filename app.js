const form = document.getElementById('persona-form');
const resultDiv = document.getElementById('persona-result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const businessName = document.getElementById('business-name').value;
  const targetMarket = document.getElementById('target-market').value;
  const productDescription = document.getElementById('product-description').value;

  const data = { businessName, targetMarket, productDescription };

  try {
    // Send data to the serverless function
    const response = await fetch('/.netlify/functions/persona-maker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Display the persona or an error message
    if (result.persona) {
      resultDiv.innerHTML = `<strong>Generated Persona:</strong><br>${result.persona}`;
    } else {
      resultDiv.textContent = result.error || 'Error generating persona.';
    }
  } catch (error) {
    resultDiv.textContent = 'Error connecting to server.';
    console.error(error);
  }
});
