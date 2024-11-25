// Seleccionar el formulario y el div para mostrar resultados
const form = document.getElementById('persona-form'); // Selecciona el formulario del HTML
const resultDiv = document.getElementById('persona-result'); // Donde se mostrará la respuesta

// Agregar evento para manejar el envío del formulario
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Previene que la página se recargue al enviar el formulario

  // Obtener los valores del formulario desde los inputs
  const businessName = document.getElementById('business-name').value; // Nombre del negocio
  const targetMarket = document.getElementById('target-market').value; // Mercado objetivo
  const productDescription = document.getElementById('product-description').value; // Descripción del producto

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

    // Mostrar la persona generada o un mensaje de error
    if (result.persona) {
      // Formatear el contenido generado para que se vea mejor
      const formattedPersona = result.persona
        .split('\n') // Dividir el texto en líneas según los saltos de línea (\n)
        .filter(line => line.trim() !== '') // Quitar líneas vacías
        .map(line => `<p>${line}</p>`) // Envolver cada línea en un párrafo (<p>)
        .join(''); // Combinar todas las líneas formateadas en un solo string HTML

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
    resultDiv.textContent = 'Error al conectarse con el servidor.';
    console.error(error); // Imprime el error en la consola del navegador
  }
});
