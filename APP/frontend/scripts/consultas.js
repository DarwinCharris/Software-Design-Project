document.getElementById("apagado").style.display = 'none';
document.getElementById("error").style.display = 'none';
document.getElementById("notf").style.display = 'none';
document.getElementById("parte2").style.display = 'none';

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



document.getElementById('formulario').addEventListener('submit', function (event) {
  //Mandar el valor 
  const id = document.getElementById('doc').value;
  fetch(`http://127.0.0.1:3003/findbyid/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      if (data["status"] === "true") {
        document.getElementById("parte2").style.display = '';
        document.getElementById("notf").style.display = 'none';
        document.getElementById("error").style.display = 'none';
        if (data["typeid"] === "1") {
          document.getElementById("info_tipo").textContent = "CC"
        } else {
          document.getElementById("info_tipo").textContent = "TI"
        }
        document.getElementById("info_id").textContent = data["id"]
        document.getElementById("info_name").textContent = data["firstname"]
        document.getElementById("info_segname").textContent = data["secondname"]
        document.getElementById("info_apellido").textContent = data["lastsnames"]
        document.getElementById("info_fecha").textContent = data["birthdate"]
        document.getElementById("info_genero").textContent = data["gender"]
        document.getElementById("info_mail").textContent = data["email"]
        document.getElementById("info_tel").textContent = data["phone"]
        document.getElementById("usuario2").src = data["imageUrl"]
      } else if (data["status"] === "NA") {
        //Mostrar que el usuario no se ha encontrado
        document.getElementById("parte2").style.display = 'none';
        document.getElementById("notf").style.display = '';
        document.getElementById("error").style.display = 'none';
      } else if (data["status"] === "false") {
        //Indicar el error y no mostrar nada
        document.getElementById("parte2").style.display = 'none';
        document.getElementById("error").style.display = '';
        document.getElementById("notf").style.display = 'none';
        document.getElementById("error").textContent = data["type"]
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al realizar la solicitud');
    });
});