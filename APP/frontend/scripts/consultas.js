document.getElementById("apagado").style.display = 'none';
document.getElementById("error").style.display = 'none';
document.getElementById("notf").style.display = 'none';
document.getElementById("parte2").style.display = 'none';
document.getElementById("popup").style.display = 'none';
const allDiv = document.querySelector(".all").style.display = "none";
const datos = {}

const selectTrigger = document.querySelector('.select-trigger');
const dropdown = document.querySelector('.select-dropdown');

// Toggle dropdown on click
selectTrigger.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown if clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.custom-select')) {
    dropdown.style.display = 'none';
  }
});

// Obtener los checkboxes y la tabla
const checkboxes = document.querySelectorAll('.select-dropdown input[type="checkbox"]');
const table = document.querySelector('table');

// Configuración inicial: columnas visibles por defecto
const defaultVisibleColumns = [1, 2, 4, 9]; // Índices de las columnas visibles por defecto

// Función para mostrar u ocultar columnas de la tabla
function toggleColumn(index, show) {
  // Iterar por todas las filas de la tabla
  table.querySelectorAll('tr').forEach((row) => {
    const cells = row.children; // Obtener celdas de la fila
    if (cells[index]) {
      cells[index].style.display = show ? '' : 'none';
    }
  });
}

// Inicializar estado de los checkboxes y columnas visibles
checkboxes.forEach((checkbox, index) => {
  const isDefaultVisible = defaultVisibleColumns.includes(index);
  checkbox.checked = isDefaultVisible; // Marcar checkbox si está en las columnas visibles por defecto
  toggleColumn(index, isDefaultVisible); // Mostrar u ocultar columna

  // Asociar evento de cambio a cada checkbox
  checkbox.addEventListener('change', () => {
    toggleColumn(index, checkbox.checked);
  });
});


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
  event.preventDefault();
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
        if(data["gender"] ==="M"){
          document.getElementById("info_genero").textContent = "Masculino"
        }else if(data["gender"] === "F"){
          document.getElementById("info_genero").textContent = "Femenino"
        }else if (data["gender"] === "NB"){
          document.getElementById("info_genero").textContent = "No Binario"
        }else if(data["gender"] ==="NA"){
          document.getElementById("info_genero").textContent = "Prefiero no decirlo"
        }
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
document.getElementById("findall").onclick = function () {
  // Realiza la petición a la API
  fetch(`http://127.0.0.1:3003/findall/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }) // Reemplaza con la URL de la API
    .then(response => response.json())
    .then(data => {
      // Obtén el cuerpo de la tabla donde se llenarán los datos
      const tableBody = document.querySelector("#data-table tbody");
      tableBody.innerHTML = ""; // Limpia la tabla antes de llenarla

      data.forEach(persona => {
        // Crea una fila
        const row = document.createElement("tr");

        // Mapea los datos según las columnas
        row.innerHTML = `
          <td>${persona.typeid === "1" ? "CC" : "TI"}</td>
          <td>${persona.id}</td>
          <td>${persona.firstname}</td>
          <td>${persona.secondname}</td>
          <td>${persona.lastsnames}</td>
          <td>${persona.birthdate}</td>
          <td>${persona.gender === "M" ? "Masculino" :
            persona.gender === "F" ? "Femenino" :
              persona.gender === "NB" ? "No Binario" : "NA"
          }</td>
          <td>${persona.email}</td>
          <td>${persona.phone}</td>
          <td><a style="color: blue; text-decoration: underline; cursor: pointer;" 
                 onclick="llenarPersona('${persona.id}', '${persona.firstname}', '${persona.secondname}', 
                                         '${persona.lastsnames}', '${persona.birthdate}', '${persona.gender}', 
                                         '${persona.email}', '${persona.phone}', 
                                         '${persona.typeid === "1" ? "CC" : "TI"}', 
                                         '${persona.imageUrl || "imagen_no_disponible"}')">ver más</a>
          </td>
        `;
        // Agrega la fila a la tabla
        tableBody.appendChild(row);
        ocultarColumnas();
      });
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
    });
};

function ocultarColumnas() {
  // Selecciona la tabla
  const table = document.querySelector('table');
  
  // Columnas que NO deben ser ocultadas (índices 1, 2, 4 y 9)
  const columnasNoOcultar = [1, 2, 4, 9];

  // Obtener todas las filas del cuerpo de la tabla
  const filas = table.querySelectorAll('tbody tr');

  // Iterar sobre todas las filas
  filas.forEach(fila => {
    // Obtener todas las celdas (td) de la fila
    const celdas = fila.getElementsByTagName('td');

    // Iterar sobre las celdas y ocultar las que no están en las columnas que no deben ser ocultadas
    for (let i = 0; i < celdas.length; i++) {
      if (!columnasNoOcultar.includes(i)) {
        celdas[i].style.display = 'none'; // Ocultar la celda
      }
    }
  });

  // Ocultar los encabezados (th) de las columnas correspondientes
  const encabezados = table.querySelectorAll('thead th');
  encabezados.forEach((th, i) => {
    if (!columnasNoOcultar.includes(i)) {
      th.style.display = 'none'; // Ocultar el encabezado
    }
  });

  //desmarcar los checkboxes
  document.getElementById("tipo_c").checked = false;
  document.getElementById("documento_c").checked = true;
  document.getElementById("name_c").checked = true;
  document.getElementById("segname_c").checked = false;
  document.getElementById("apellidos_c").checked = true;
  document.getElementById("genero_c").checked = false;
  document.getElementById("mail_c").checked = false;
  document.getElementById("telefono_c").checked = false;
}


function llenarPersona(id, firstname, secondname, lastsnames, birthdate, gender, email, phone, typeid, imageUrl) {
  document.getElementById("info_id_all").textContent = id
  document.getElementById("info_name_all").textContent = firstname
  document.getElementById("info_segname_all").textContent = secondname
  document.getElementById("info_apellido_all").textContent = lastsnames
  document.getElementById("info_fecha_all").textContent = birthdate
  if(gender ==="M"){
    document.getElementById("info_genero_all").textContent = "Masculino"
  }else if(gender === "F"){
    document.getElementById("info_genero_all").textContent = "Femenino"
  }else if (gender === "NB"){
    document.getElementById("info_genero_all").textContent = "No Binario"
  }else if(gender ==="NA"){
    document.getElementById("info_genero_all").textContent = "Prefiero no decirlo"
  }
  
  document.getElementById("info_mail_all").textContent = email
  document.getElementById("info_tel_all").textContent = phone
  document.getElementById("usuario2_all").src = imageUrl
  document.getElementById("info_tipo_all").textContent = typeid
  // Mostrar el pop up 
  document.getElementById("principal").style.display = 'none';
  document.getElementById("popup").style.display = '';
}

document.getElementById("cerrar").addEventListener("click", ()=>{
  document.getElementById("principal").style.display = '';
  document.getElementById("popup").style.display = 'none';
});





