(function () {
    let DB;
    let idCliente;
    const formulario = document.querySelector('#formulario');
   
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');
    const telefonoInput = document.querySelector('#telefono');
        document.addEventListener('DOMContentLoaded', () => {
            conectarDB();
            // Actualizar el registro 
            formulario.addEventListener('submit', actualizarCliente);
        // Verificar el ID de la URL 
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        console.log("id: ".idCliente)
        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente)
            }, 100);

        }
        });
        function actualizarCliente(e) {
            e.preventDefault();
            if( nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '' ) {
                imprimirAlerta('Todos los campos son obligatorios', 'error');
                return;
            }
             // actualizar...
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number( idCliente )
        };
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado)

        transaction.oncomplete = function(){
            imprimirAlerta('Editado Correctamente')
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }
        transaction.onerror = function (error) {
            console.log(error) // puedes ver en el target cuando ingresas un gmail igual
            imprimirAlerta('Hubo un error', 'error')
            
        }
        }

        function obtenerCliente(id) {
            console.log(id)
            const transaction = DB.transaction(['crm'], 'readwrite') // facil pudo ser readonly
            const objectStore = transaction.objectStore('crm')

            const cliente = objectStore.openCursor();
            cliente.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                  
                    if (cursor.value.id === Number(id)) {
                        console.log(cursor.value)
                        llenarFormulario(cursor.value)
                    }
                    cursor.continue();
                }
                
            }
            
        }
        function llenarFormulario(datosCliente) {
            const { nombre, email, empresa, telefono } = datosCliente;
            nombreInput.value = nombre;
            emailInput.value = email;
            empresaInput.value = empresa;
            telefonoInput.value = telefono;
        }
        function conectarDB(){
            const abrirConexion = window.indexedDB.open('crm' , 1 )
    
            abrirConexion.onerror = function () {
                console.log('Hubo un error');
            };
            abrirConexion.onsuccess = function () {
                DB = abrirConexion.result;
            }
        }
})();