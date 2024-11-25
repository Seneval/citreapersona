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
      // Split the persona into sections for better readability
      const formattedPersona = result.persona
        .split('\n') // Split the response by line breaks
        .filter(line => line.trim() !== '') // Remove empty lines
        .map(line => `<p>${line}</p>`) // Wrap each line in <p> tags
        .join(''); // Combine them into a single HTML string

      // Insert the formatted persona into the result div
      resultDiv.innerHTML = `
        <strong>Generated Persona:</strong>
        <div class="persona-content">
          ${formattedPersona}
        </div>
      `;
    } else {
      // Display an error message if persona generation fails
      resultDiv.textContent = result.error || 'Error generating persona.';
    }
  } catch (error) {
    // Handle any network or server errors
    resultDiv.textContent = 'Error connecting to server.';
    console.error(error);
  }
});
