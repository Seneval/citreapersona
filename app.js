// Select the form and result div
const form = document.getElementById('persona-form');
const resultDiv = document.getElementById('persona-result');

// Add event listener for form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form from reloading the page

  // Get form values
  const businessName = document.getElementById('business-name').value;
  const targetMarket = document.getElementById('target-market').value;
  const productDescription = document.getElementById('product-description').value;

  // Package data into an object
  const data = { businessName, targetMarket, productDescription };

  try {
    // Make a POST request to the serverless function
    const response = await fetch('/.netlify/functions/persona-maker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Parse the response JSON
    const result = await response.json();

    // Display the persona or an error message
    if (result.persona) {
      // Replace newlines with table formatting for better structure
      const formattedPersona = result.persona
        .split('\n') // Split response by newlines
        .filter(line => line.trim() !== '') // Remove empty lines
        .map(line => `<p>${line}</p>`) // Wrap each line in <p> tags
        .join(''); // Combine into a single string

      // Insert the formatted persona into the result div
      resultDiv.innerHTML = `
        <strong>Persona Generada:</strong>
        <div class="persona-content">
          ${formattedPersona}
        </div>
      `;
    } else {
      // Show error message if persona generation fails
      resultDiv.textContent = result.error || 'Error al generar la persona.';
    }
  } catch (error) {
    // Handle any network or server errors
    resultDiv.textContent = 'Error al conectarse con el servidor.';
    console.error(error);
  }
});
