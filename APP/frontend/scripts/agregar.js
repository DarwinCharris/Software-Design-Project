var data = {};
var data2 = {
    "name": ""
}
var doc = ""
var type = ""
document.getElementById("parte2").style.display = 'none';
document.getElementById("load").style.display = 'none';

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();  // Evita que el formulario se envíe automáticamente
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.style.display = 'none'; // Cambiamos el display a flex
    });

    // Obtener los valores de los campos
    const tipo_doc = document.getElementById("tipoDocumento").value;
    const id = document.getElementById("doc").value;
    const nombre = document.getElementById("nombre").value;
    const segname = document.getElementById("segnombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const fecha = document.getElementById("fecha").value;
    const genero = document.getElementById("Genero").value;
    const correo = document.getElementById("mail").value;
    const celular = document.getElementById("tel").value;

    // Crear el objeto data
    data["tipo"] = tipo_doc;
    data["id"] = id;
    data["name"] = nombre;
    data["segname"] = segname;
    data["apellido"] = apellidos;
    data["fecha"] = fecha;
    data["genero"] = genero;
    data["mail"] = correo;
    data["tel"] = celular;
    // Usar fetch para enviar la solicitud POST
    fetch('http://127.0.0.1:3002/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Indicamos que estamos enviando JSON
        },
        body: JSON.stringify(data)  // Convertimos el objeto data a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();  // Convertimos la respuesta a JSON
        })
        .then(jsonResponse => {
            if (jsonResponse.status === "True") {
                document.getElementById("parte1").style.display = 'none';
                document.getElementById("parte2").style.display = '';
                //Colocar la información del usuario
                for (const key in data) {

                    if (key !== "status" && key != "foto") {
                        if (key === "tipo") {
                            const element = document.getElementById("info_tipo")
                            if (data[key] === "1") {
                                element.textContent = "CC"
                            } else {
                                element.textContent = "TI"
                            }
                        } else if (key === "genero") {
                            const element = document.getElementById("info_genero")
                            if (data["genero"] === "M") {
                                element.textContent = "Masculino"
                            } else if (data["genero"] === "F") {
                                element.textContent = "Femenino"
                            } else if (data["genero" === "NB"]) {
                                element.textContent = "No binario"
                            } else {
                                element.textContent = "Prefiero no decirlo"
                            }
                        } else {
                            const element = document.getElementById(`info_${key}`);
                            if (element) {
                                element.textContent = data[key];
                            }
                        }


                    }
                }
                const fot = document.getElementById("usuario2")
                fot.src = data["foto"]
                //Modificar la toponimia
                const toponimia = document.getElementById("topo_parrafo")
                if (data2["name"] === "" || data2["name"] !== data["name"]) {
                    //Mostrar el loader
                    document.getElementById("load").style.display = '';
                    document.getElementById("topo").style.display = 'none';
                    data2["name"] = data["name"]
                    //Mandar a la appi y reemplazar

                    fetch(`http://127.0.0.1:3002/toponimia/${data2["name"]}`, {
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
                        .then(datos => {

                            toponimia.textContent = datos["result"]
                            document.getElementById("load").style.display = 'none';
                            document.getElementById("topo").style.display = '';
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Error al realizar la solicitud');
                        });


                }
            } else {
                for (const key in jsonResponse) {
                    if (key !== "status") { // Verificamos que la clave no sea "status"
                        const element = document.getElementById(`err_${key}`);
                        element.style.display = 'flex';
                        if (element) {
                            element.textContent = jsonResponse[key]; // Modificamos el contenido del elemento con id err_{key}
                        }
                    }
                }
            }
            console.log("Respuesta de la API:", jsonResponse);  // Mostramos la respuesta de la API
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);  // Manejo de errores
        });
});


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('imagen').addEventListener('change', function (event) {
        const element = document.getElementById(`err_foto`);
        element.style.display = 'none';
        const file = event.target.files[0];
        const maxSizeMB = 2;

        if (!file) {
            alert('No se seleccionó ningún archivo.');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert('El archivo excede el tamaño máximo de 2 MB.');
            event.target.value = '';
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            alert('El archivo no es un formato de imagen válido.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Image = e.target.result;

            // Verifica si el elemento <img id="usuario"> existe
            const imgElement = document.getElementById('usuario');
            if (imgElement) {
                imgElement.src = base64Image; // Asigna la imagen al elemento <img>
            } else {
                console.error('El elemento <img id="usuario"> no existe en el DOM.');
            }

            data["foto"] = base64Image;
            console.log('Imagen cargada correctamente:', data);
        };

        reader.onerror = function () {
            alert('Hubo un error al leer el archivo.');
        };

        reader.readAsDataURL(file);
    });
});

document.getElementById('atras').onclick = function () {
    //Ocultad y mostrar la info
    document.getElementById("parte2").style.display = 'none';
    document.getElementById("parte1").style.display = '';
    //Colocar en los campos de texto los valores de data
    document.getElementById("tipoDocumento").value = data["tipo"]
    document.getElementById("doc").value = data["id"]
    document.getElementById("nombre").value = data["name"]
    document.getElementById("segnombre").value = data["segname"]
    document.getElementById("apellidos").value = data["apellido"]
    document.getElementById("fecha").value = data["fecha"]
    document.getElementById("Genero").value = data["genero"]
    document.getElementById("mail").value = data["mail"]
    document.getElementById("tel").value = data["tel"]
    document.getElementById("usuario").src = data["foto"]
};
document.getElementById('enviar').onclick = function () {
    fetch('http://127.0.0.1:3002/insert/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Indicamos que estamos enviando JSON
        },
        body: JSON.stringify(data)  // Convertimos el objeto data a JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                doc = data["id"]
                type = data["tipo"]
                addlog(doc, type, "CREATE");

            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
        });

}

function addlog(doc, type, action) {
    fetch(`http://127.0.0.1:3007/write/${doc}/${type}/${action}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            } else {
                alert("Enviado al log")
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al realizar la solicitud en log');
        });
}
