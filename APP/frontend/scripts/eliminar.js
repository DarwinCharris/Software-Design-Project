document.getElementById("parte2").style.display = "none";
document.getElementById("error").style.display = 'none';
document.getElementById("notf").style.display = 'none';
var doc = ""; 
var type = "";
document.getElementById('formulario').addEventListener('submit', function (event) {
  event.preventDefault();
  const id = document.getElementById('id').value;
  fetch(`http://127.0.0.1:3005/findbyid/${id}`, {
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
      if (data["status"] === "true") {
        doc=data["id"]
        type =data["typeid"]
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
        if (data["gender"] === "M") {
          document.getElementById("info_genero").textContent = "Masculino"
        } else if (data["gender"] === "F") {
          document.getElementById("info_genero").textContent = "Femenino"
        } else if (data["gender"] === "NB") {
          document.getElementById("info_genero").textContent = "No Binario"
        } else if (data["gender"] === "NA") {
          document.getElementById("info_genero").textContent = "Prefiero no decirlo"
        }
        document.getElementById("info_mail").textContent = data["email"]
        document.getElementById("info_tel").textContent = data["phone"]
        document.getElementById("usuario2").src = data["imageUrl"]

        
        document.getElementById("notf").style.display = 'none';
        document.getElementById("error").style.display = 'none';
        document.getElementById("parte2").style.display = '';
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

document.getElementById("back").onclick = function () {
  window.location.reload();
};

document.getElementById("elm").onclick = function () {
  showAlert("¿Estás seguro de eliminar permanentemente a este usuario?")
  //window.location.reload();
};



// Función para mostrar el alert
function showAlert(message) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('customAlert').style.display = 'flex';
}

// Función para cerrar el alert
function closeAlert() {
  document.getElementById('customAlert').style.display = 'none';
}
document.getElementById("delete").onclick = function (){
  //Eliminar a la persona 
  fetch(`http://127.0.0.1:3005/delete/${doc}`, {
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
      //Hacer el log
      addlog(doc, type, "DELETE")

      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al realizar la solicitud');
    });
};

function addlog(doc, type, action){
  fetch(`http://127.0.0.1:3007/write/${doc}/${type}/${action}/`, {
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
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al realizar la solicitud en log');
    });
}