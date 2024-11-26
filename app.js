// Seleccionar el formulario, el div para mostrar resultados, y el spinner
const form = document.getElementById('persona-form');
const resultDiv = document.getElementById('persona-result');
const loadingDiv = document.getElementById('loading-spinner'); // Spinner de carga

// Agregar evento para manejar el envío del formulario
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar que la página se recargue al enviar el formulario

  // Mostrar el spinner y limpiar resultados anteriores
  loadingDiv.style.display = 'block'; // Mostrar spinner
  resultDiv.innerHTML = ''; // Limpiar resultados

  // Obtener los valores del formulario desde los inputs
  const businessName = document.getElementById('business-name').value;
  const targetMarket = document.getElementById('target-market').value;
  const productDescription = document.getElementById('product-description').value;

  // Crear un objeto con los datos del formulario para enviarlo al backend
  const data = { businessName, targetMarket, productDescription };

  try {
    // Hacer una solicitud POST al backend (serverless function)
    const response = await fetch('/.netlify/functions/persona-maker', {
      method: 'POST', // Método POST para enviar datos
      headers: { 'Content-Type': 'application/json' }, // Tipo de contenido JSON
      body: JSON.stringify(data), // Convierte el objeto data a un string JSON
    });

    // Parsear la respuesta como JSON
    const result = await response.json();

    // Ocultar el spinner una vez que se obtiene la respuesta
    loadingDiv.style.display = 'none';

    // Mostrar la persona generada o un mensaje de error
    if (result.persona) {
      // Formatear el contenido generado para que se vea mejor
      const formattedPersona = result.persona
        .split('\n') // Dividir en líneas según los saltos de línea (\n)
        .filter(line => line.trim() !== '') // Quitar líneas vacías
        .map(line => `<p>${line}</p>`) // Envolver cada línea en un párrafo (<p>)
        .join('');

      // Mostrar el contenido formateado dentro del div de resultados
      resultDiv.innerHTML = `
        <strong>Persona Generada:</strong>
        <div class="persona-content">
          ${formattedPersona}
        </div>
      `;
    } else {
      // Si no se generó la persona, mostrar un mensaje de error del backend
      resultDiv.textContent = result.error || 'Error al generar la persona.';
    }
  } catch (error) {
    // Manejar errores de red o del servidor
    loadingDiv.style.display = 'none'; // Ocultar el spinner
    resultDiv.textContent = 'Error al conectarse con el servidor.';
    console.error(error); // Imprime el error en la consola del navegador
  }
});
