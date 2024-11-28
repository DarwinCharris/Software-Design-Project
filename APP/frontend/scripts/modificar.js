var data = {};
var dataf = {};
var doc = "";
var type = "";
// Setea todos los elementos de la clase error como display none
window.onload = function () {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
};

// Función para mostrar el alert
function showAlert() {
    document.getElementById('customAlert').style.display = 'flex';
}

// Función para cerrar el alert
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Recoge la información de todos los inputs
    const inputs = document.querySelectorAll('#formulario input, #formulario select');
    // Reinicia solo los valores del objeto data
    data = {};

    inputs.forEach(input => {
        const id = input.id; // Obtiene el ID del input
        const value = input.value.trim(); // Obtiene el valor del input sin espacios en blanco

        if (value) { // Solo agrega al objeto data si el valor no está vacío
            data[id] = value;
        }
    });

    console.log('Datos recogidos:', data); // Muestra los datos en la consola

    // Verifica y actualiza los objetos data y dataf
    if ('imagen' in data) {
        delete data['imagen'];
    }
    if ('foto' in dataf) {
        data['foto'] = dataf['foto'];
    }

    console.log('Nueva data:', data); // Muestra la nueva data en la consola

    // Realiza el fetch a la API
    fetch('http://127.0.0.1:3004/validate/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(res => {
            if (res.status === "True") {
                const errorElements = document.querySelectorAll('.error');
                errorElements.forEach(element => {
                    element.style.display = 'none';
                });
                showAlert();
            } else if (res.status === "False") {
                Object.keys(res).forEach(key => {
                    if (key !== "status") {
                        const errorElement = document.getElementById(key);
                        if (errorElement) {
                            errorElement.textContent = res[key];
                            errorElement.style.display = 'block';
                        }
                    }
                });
            } else if (res.status === "NONE") {
                alert('Suministra data');
            }
        })
        .catch(error => {
            console.error('Error al realizar el fetch:', error);
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

            dataf["foto"] = base64Image;
            console.log('Imagen cargada correctamente:', dataf);
        };

        reader.onerror = function () {
            alert('Hubo un error al leer el archivo.');
        };

        reader.readAsDataURL(file);
    });
});

document.getElementById("delete").addEventListener("click", async function () {
    try {
        const response = await fetch('http://127.0.0.1:3004/update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            doc = data["id"];
            type = data["typeid"];
            addlog(doc, type, "UPDATE"); // Espera a que el log se registre
            //location.reload(); // Recarga la página solo después de todo
            
        } else {
            alert('Error al realizar la actualización');
        }
    } catch (error) {
        console.error('Error al realizar el fetch:', error);
    }
    
});

function addlog(doc, type, action) {
    const url = `http://127.0.0.1:3007/write/${doc}/${type}/${action}/`;
    console.log('URL de la API:', url); // Esto te muestra cómo se está generando la URL

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            else{
                console.log("ok")
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al realizar la solicitud en log');
        });
}
