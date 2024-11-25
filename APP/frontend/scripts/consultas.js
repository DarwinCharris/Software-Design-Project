document.getElementById("apagado").style.display = 'none';

//Mostrar elementos dependiendo del tipo de consulta
function cambiarVisibilidad() {
  const tipo = document.getElementById("tipo").value;
  const byidDiv = document.querySelector(".byid");
  const allDiv = document.querySelector(".all");

  if (tipo === "0") {
    byidDiv.style.display = "none";
    allDiv.style.display = "none";
  } else if (tipo === "1") {
    byidDiv.style.display = "block";
    allDiv.style.display = "none";
  } else if (tipo === "2") {
    byidDiv.style.display = "none";
    allDiv.style.display = "block";
  }
}

//Consultar si el servicio de consultas está levantado y mostrar un contenido u otro dependiendo del resultado
document.addEventListener("DOMContentLoaded", function () {
  fetch('http://127.0.0.1:3006/check')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener la respuesta de la API');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === 'running') {
        document.getElementById("apagado").style.display = 'none';
        document.getElementById("encendido").style.display = '';
      } else if (data.status === 'exited') {
        document.getElementById("apagado").style.display = '';
        document.getElementById("encendido").style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error al realizar el fetch:', error);
    });
});

document.getElementById('formulario').addEventListener('submit', function(event) {
  //Mandar el valor 
  data={
    "id":document.getElementById('doc').value
  }
  
});