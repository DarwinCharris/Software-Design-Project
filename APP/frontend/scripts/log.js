// Ensure all divs are hidden initially
document.getElementById('content1').style.display = 'none';
document.getElementById('content2').style.display = 'none';
document.getElementById('content3').style.display = 'none';

function selectOnlyThis(checkbox) {
    const checkboxes = document.getElementsByName('option');
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    });

    // Hide all content divs
    document.getElementById('content1').style.display = 'none';
    document.getElementById('content2').style.display = 'none';
    document.getElementById('content3').style.display = 'none';

    // Show the corresponding content div if checked
    if (checkbox.checked) {
        if (checkbox.value === 'option1') {
            document.getElementById('content1').style.display = '';
        } else if (checkbox.value === 'option2') {
            document.getElementById('content2').style.display = '';
        } else if (checkbox.value === 'option3') {
            document.getElementById('content3').style.display = '';
        }
    }
}
document.getElementById('fecha').addEventListener('submit', function (event) {
    event.preventDefault(); 

    // 0. Eliminar contenido dentro del div con id 'cards_for_date'
    const cardsForDate = document.getElementById('cards_for_date');
    cardsForDate.innerHTML = ''; 

    // 1. Obtener los valores de los inputs
    const fechai = document.getElementById('fechai').value;
    const fechaf = document.getElementById('fechaf').value;

    // 2. Construir la URL
    let url = `http://127.0.0.1:3007/get-data?typeC=3&datei=${fechai}`;

    if (fechaf) {
        url += `&datef=${fechaf}`;
    }
    // 3. Hacer la solicitud fetch
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 4. Si la API retorna una lista de diccionarios
            if (Array.isArray(data)) {
                data.forEach(item => {
                    // Determinar el tipo de documento
                    let tipoDocumento = '';
                    if (item.typeid == "1") {
                        tipoDocumento = 'CC';  // Si typeid es 1, tipo es CC
                    } else if (item.typeid == "2") {
                        tipoDocumento = 'TI';  // Si typeid es 2, tipo es TI
                    }

                    // Crear el contenido para cada item
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <p><strong>Tipo de documento:</strong> ${tipoDocumento}
                        <br>
                        <strong>Documento:</strong> ${item.id}
                        <br>
                        <strong>Acción:</strong> ${item.action}
                        <br>
                        <strong>Detalles:</strong> ${item.details}
                        <br>
                        <strong>Fecha:</strong> ${item.time}
                        </p>
                    `;
                    cardsForDate.appendChild(card);
                });
            } else if (data.error) {
                // 5. Si la API devuelve un error
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('card');
                errorDiv.innerHTML = `<h1>No existen registros</h1>`;
                cardsForDate.appendChild(errorDiv);
            }
        })
        .catch(error => {
            // En caso de un error en la petición
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('card');
            errorDiv.innerHTML = `<h1>Error al obtener datos</h1>`;
            cardsForDate.appendChild(errorDiv);
        });
});
document.getElementById('documento').addEventListener('submit', function (event) {
    event.preventDefault(); 

    // 0. Eliminar contenido dentro del div con id 'cards_for_doc'
    const cardsForDoc = document.getElementById('cards_for_doc');
    cardsForDoc.innerHTML = ''; 

    // 1. Obtener el valor del input tipo number con id 'id'
    const id = document.getElementById('id').value;

    // 2. Construir la URL
    const url = `http://127.0.0.1:3007/get-data?typeC=2&id=${id}`;

    // 3. Hacer la solicitud fetch
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 4. Si la API retorna una lista de diccionarios
            if (Array.isArray(data)) {
                data.forEach(item => {
                    // Determinar el tipo de documento
                    let tipoDocumento = '';
                    if (item.typeid == "1") {
                        tipoDocumento = 'CC';  // Si typeid es 1, tipo es CC
                    } else if (item.typeid == "2") {
                        tipoDocumento = 'TI';  // Si typeid es 2, tipo es TI
                    }

                    // Crear el contenido para cada item
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <p><strong>Tipo de documento:</strong> ${tipoDocumento}
                        <br>
                        <strong>Documento:</strong> ${item.id}
                        <br>
                        <strong>Acción:</strong> ${item.action}
                        <br>
                        <strong>Detalles:</strong> ${item.details}
                        <br>
                        <strong>Fecha:</strong> ${item.time}
                        </p>
                    `;
                    cardsForDoc.appendChild(card);
                });
            } else if (data.error) {
                // 5. Si la API devuelve un error
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('card');
                errorDiv.innerHTML = `<h1>No existen registros</h1>`;
                cardsForDoc.appendChild(errorDiv);
            }
        })
        .catch(error => {
            // En caso de un error en la petición
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('card');
            errorDiv.innerHTML = `<h1>Error al obtener datos</h1>`;
            cardsForDoc.appendChild(errorDiv);
        });
});
document.getElementById('tipo').addEventListener('submit', function (event) {
    event.preventDefault(); 

    // 0. Eliminar contenido dentro del div con id 'cards_for_type'
    const cardsForType = document.getElementById('cards_for_type');
    cardsForType.innerHTML = ''; 

    // 1. Obtener el valor del select con id 'typeid'
    const typeid = document.getElementById('typeid').value;

    // 2. Construir la URL
    const url = `http://127.0.0.1:3007/get-data?typeC=1&typeid=${typeid}`;

    // 3. Hacer la solicitud fetch
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 4. Si la API retorna una lista de diccionarios
            if (Array.isArray(data)) {
                data.forEach(item => {
                    // Determinar el tipo de documento
                    let tipoDocumento = '';
                    if (item.typeid == "1") {
                        tipoDocumento = 'CC';  // Si typeid es 1, tipo es CC
                    } else if (item.typeid == "2") {
                        tipoDocumento = 'TI';  // Si typeid es 2, tipo es TI
                    }

                    // Crear el contenido para cada item
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <p><strong>Tipo de documento:</strong> ${tipoDocumento}
                        <br>
                        <strong>Documento:</strong> ${item.id}
                        <br>
                        <strong>Acción:</strong> ${item.action}
                        <br>
                        <strong>Detalles:</strong> ${item.details}
                        <br>
                        <strong>Fecha:</strong> ${item.time}
                        </p>
                    `;
                    cardsForType.appendChild(card);
                });
            } else if (data.error) {
                // 5. Si la API devuelve un error
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('card');
                errorDiv.innerHTML = `<h1>No existen registros</h1>`;
                cardsForType.appendChild(errorDiv);
            }
        })
        .catch(error => {
            // En caso de un error en la petición
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('card');
            errorDiv.innerHTML = `<h1>Error al obtener datos</h1>`;
            cardsForType.appendChild(errorDiv);
        });
});

