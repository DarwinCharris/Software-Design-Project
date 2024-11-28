document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('service');
  
    // Realizar el fetch inicial para establecer el estado del checkbox
    fetch('http://127.0.0.1:3006/check')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener la respuesta de la API');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'running') {
          checkbox.checked = true; // Marcar el checkbox si el servicio está en ejecución
        } else if (data.status === 'exited') {
          checkbox.checked = false; // Desmarcar el checkbox si el servicio está detenido
        }
      })
      .catch(error => {
        console.error('Error al realizar el fetch:', error);
      });
  
    // Detectar cambios en el estado del checkbox
    checkbox.addEventListener('change', () => {
      const status = checkbox.checked ? 'on' : 'off';
      fetch(`http://127.0.0.1:3006/turn/${status}`, {
        method: 'GET'  // Usamos GET para cambiar el estado del contenedor
      })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Mostrar la respuesta de la API
      })
      .catch(error => {
        console.error('Error al ejecutar la solicitud de cambio de estado:', error);
      });
    });
  });
  document.getElementById('repo_app').addEventListener('click', function() {
    window.open('https://github.com/DarwinCharris/Software-Design-Project', '_blank');
  });
  document.getElementById('repo_azure').addEventListener('click', function() {
    window.open('https://github.com/LuisangelParra/CRUDToponimia-Microservices', '_blank');
  });