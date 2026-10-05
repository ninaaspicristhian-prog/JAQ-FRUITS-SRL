/* ==================================================
   TIENDA FRUTI JHANET
================================================== */


/* ==================================================
   PRODUCTOS
================================================== */

const productos = [

   {
        id: 1,
        nombre: "Frutilla",
        categoria: "Frutas",
        imagen: "imagenes/frutas/frutilla.jpeg",

        opciones: [
            {
                nombre: "Normal",
                precio: 12,
                unidad: "kg"
            },
            {
                nombre: "Grande",
                precio: 18,
                unidad: "kg"
            },
            {
                nombre: "Extra grande",
                precio: 22,
                unidad: "kg"
            }
        ]
    },
    {
        id: 2,
        nombre: "Maní",
        categoria: "Frutos secos",
        precio: 15,
        unidad: "500 g",
        emoji: "🥜"
    },

    {
        id: 3,
        nombre: "Nueces",
        categoria: "Frutos secos",
        precio: 35,
        unidad: "500 g",
        emoji: "🌰"
    },

    {
        id: 4,
        nombre: "Pasas",
        categoria: "Frutos secos",
        precio: 18,
        unidad: "500 g",
        emoji: "🍇"
    },

    {
        id: 5,
        nombre: "Pistachos",
        categoria: "Frutos secos",
        precio: 45,
        unidad: "500 g",
        emoji: "🥜"
    },

    {
        id: 6,
        nombre: "Chirimoya",
        categoria: "Frutas",
        precio: 15,
        unidad: "kg",
        emoji: "🍈"
    },

    {
        id: 7,
        nombre: "Manzana",
        categoria: "Frutas",
        precio: 12,
        unidad: "kg",
        emoji: "🍎"
    },

    {
        id: 8,
        nombre: "Banana",
        categoria: "Frutas",
        precio: 8,
        unidad: "kg",
        emoji: "🍌"
    },

    {
        id: 9,
        nombre: "Naranja",
        categoria: "Frutas",
        precio: 10,
        unidad: "kg",
        emoji: "🍊"
    },

    {
        id: 10,
        nombre: "Mandarina",
        categoria: "Frutas",
        precio: 12,
        unidad: "kg",
        emoji: "🍊"
    },

    {
        id: 11,
        nombre: "Arroz",
        categoria: "Abarrotes",
        precio: 8,
        unidad: "kg",
        emoji: "🍚"
    },

    {
        id: 12,
        nombre: "Azúcar",
        categoria: "Abarrotes",
        precio: 7,
        unidad: "kg",
        emoji: "🧂"
    }

];


/* ==================================================
   VARIABLES
================================================== */

let carrito = [];

const NUMERO_WHATSAPP = "59176812242";

const LIMITE_DELIVERY_GRATIS = 100;


/* ==================================================
   CARGAR CARRITO
================================================== */

function cargarCarrito() {

    const guardado =
        localStorage.getItem("carritoFrutiJhanet");

    if (guardado) {

        carrito = JSON.parse(guardado);

    }

    actualizarCarrito();

}


/* ==================================================
   GUARDAR CARRITO
================================================== */

function guardarCarrito() {

    localStorage.setItem(
        "carritoFrutiJhanet",
        JSON.stringify(carrito)
    );

}


/* ==================================================
   MOSTRAR PRODUCTOS
================================================== */

function mostrarProductos(lista = productos) {

    const contenedor =
        document.getElementById("listaProductos");

    contenedor.innerHTML = "";

    lista.forEach(producto => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className = "producto";

        /* ------------------------------------------
           SI EL PRODUCTO TIENE VARIAS OPCIONES
        ------------------------------------------ */

        let opcionesHTML = "";

        if (producto.opciones) {

            opcionesHTML = `
                <div class="titulo-opciones">
                    Selecciona el tipo:
                </div>

                <div class="opciones-precio">

                    ${producto.opciones.map((opcion, indice) => `

                        <label class="opcion-precio">

                            <input
                                type="radio"
                                name="opcion-${producto.id}"
                                value="${indice}"
                                ${indice === 0 ? "checked" : ""}
                            >

                            <span>
                                ${opcion.nombre}
                            </span>

                            <strong>
                                Bs ${opcion.precio}/${opcion.unidad}
                            </strong>

                        </label>

                    `).join("")}

                </div>
            `;

        } else {

            /* ------------------------------------------
               PRODUCTOS QUE SOLO TIENEN UN PRECIO
            ------------------------------------------ */

            opcionesHTML = `
                <p>
                    ${producto.unidad}
                </p>

                <div class="precio">
                    Bs ${producto.precio}
                </div>
            `;

        }


        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </div>


            <div class="producto-info">

                <span class="categoria-producto">
                    ${producto.categoria}
                </span>


                <h3>
                    ${producto.nombre}
                </h3>


                ${opcionesHTML}


                <button
                    class="boton-agregar"
                    onclick="agregarAlCarrito(${producto.id})"
                >
                    🛒 Agregar
                </button>

            </div>

        `;

        contenedor.appendChild(tarjeta);

    });

}

/* ==================================================
   AGREGAR AL CARRITO
================================================== */

function agregarAlCarrito(id) {

    const producto =
        productos.find(p => p.id === id);

    if (!producto) return;


    /* ------------------------------------------
       SI EL PRODUCTO TIENE OPCIONES
    ------------------------------------------ */

    let opcionSeleccionada = null;
    let opcionIndex = 0;

    if (producto.opciones) {

        const radioSeleccionado =
            document.querySelector(
                `input[name="opcion-${id}"]:checked`
            );

        if (radioSeleccionado) {

            opcionIndex =
                Number(radioSeleccionado.value);

            opcionSeleccionada =
                producto.opciones[opcionIndex];

        } else {

            opcionSeleccionada =
                producto.opciones[0];

        }

    } else {

        /* Producto normal sin variantes */

        opcionSeleccionada = {

            nombre: "Único",

            precio: producto.precio,

            unidad: producto.unidad

        };

    }


    /* ------------------------------------------
       BUSCAR SI YA EXISTE ESA MISMA VARIANTE
    ------------------------------------------ */

    const existente =
        carrito.find(
            p =>
                p.id === id &&
                p.opcionIndex === opcionIndex
        );


    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            categoria: producto.categoria,

            imagen: producto.imagen,

            opcionIndex: opcionIndex,

            tipo: opcionSeleccionada.nombre,

            precio: opcionSeleccionada.precio,

            unidad: opcionSeleccionada.unidad,

            cantidad: 1

        });

    }


    guardarCarrito();

    actualizarCarrito();


    alert(
        `${producto.nombre} - ${opcionSeleccionada.nombre} fue agregado al carrito.`
    );

}

/* ==================================================
   ACTUALIZAR CARRITO
================================================== */

function actualizarCarrito() {

    const contador =
        document.getElementById("contadorCarrito");

    const cantidad =
        carrito.reduce(
            (total, producto) =>
                total + producto.cantidad,
            0
        );

    contador.textContent = cantidad;

    mostrarCarrito();

}


/* ==================================================
   MOSTRAR CARRITO
================================================== */

function mostrarCarrito() {

    const contenedor =
        document.getElementById("productosCarrito");

    if (!contenedor) return;


    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

        calcularTotal();

        return;

    }


    contenedor.innerHTML = "";


    carrito.forEach(producto => {

        const item =
            document.createElement("div");

        item.className = "item-carrito";


        const totalProducto =
            producto.precio *
            producto.cantidad;


        item.innerHTML = `

            <div>

                <strong>
                    ${producto.nombre}
                </strong>

                <br>


                <span>
                    Tipo: ${producto.tipo}
                </span>

                <br>


                Bs ${producto.precio}/${producto.unidad}
                × ${producto.cantidad}


                <br>


                <strong>
                    Total: Bs ${totalProducto}
                </strong>

            </div>


            <div class="cantidad">

                <button
                    onclick="cambiarCantidad(
                        ${producto.id},
                        ${producto.opcionIndex},
                        -1
                    )"
                >
                    −
                </button>


                <strong>
                    ${producto.cantidad}
                </strong>


                <button
                    onclick="cambiarCantidad(
                        ${producto.id},
                        ${producto.opcionIndex},
                        1
                    )"
                >
                    +
                </button>


                <button
                    class="eliminar"
                    onclick="eliminarProducto(
                        ${producto.id},
                        ${producto.opcionIndex}
                    )"
                >
                    🗑️
                </button>

            </div>

        `;


        contenedor.appendChild(item);

    });


    calcularTotal();

}
/* ==================================================
   CAMBIAR CANTIDAD
================================================== */

function cambiarCantidad(id, opcionIndex, cambio) {

    const producto =
        carrito.find(
            p =>
                p.id === id &&
                p.opcionIndex === opcionIndex
        );

    if (!producto) return;


    producto.cantidad += cambio;


    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(
                p =>
                    !(
                        p.id === id &&
                        p.opcionIndex === opcionIndex
                    )
            );

    }


    guardarCarrito();

    actualizarCarrito();

}


/* ==================================================
   ELIMINAR PRODUCTO
================================================== */

function eliminarProducto(id, opcionIndex) {

    carrito =
        carrito.filter(
            p =>
                !(
                    p.id === id &&
                    p.opcionIndex === opcionIndex
                )
        );


    guardarCarrito();

    actualizarCarrito();

}

/* ==================================================
   CALCULAR TOTAL
================================================== */

function calcularTotal() {

    let subtotal = 0;

    carrito.forEach(producto => {

        subtotal +=
            producto.precio *
            producto.cantidad;

    });

    let delivery = 0;

    const mensaje =
        document.getElementById(
            "mensajeDelivery"
        );

    if (subtotal === 0) {

        mensaje.textContent = "";

    }

    else if (
        subtotal >=
        LIMITE_DELIVERY_GRATIS
    ) {

        delivery = 0;

        mensaje.textContent =
            "🎉 ¡Tu delivery es GRATIS!";

    }

    else {

        const falta =
            LIMITE_DELIVERY_GRATIS -
            subtotal;

        mensaje.textContent =
            `🚚 Te faltan Bs ${falta}
             para obtener delivery gratis.`;

        /*
           Por ahora colocamos Bs 10
           como delivery.

           Después podemos cambiar esto
           por la tarifa real de Fruti Jhanet.
        */

        delivery = 10;

    }

    document.getElementById(
        "subtotal"
    ).textContent = subtotal;

    document.getElementById(
        "precioDelivery"
    ).textContent = delivery;

    document.getElementById(
        "total"
    ).textContent =
        subtotal + delivery;

}


/* ==================================================
   ABRIR / CERRAR CARRITO
================================================== */

function abrirCarrito() {

    document.getElementById(
        "ventanaCarrito"
    ).style.display = "flex";

}

function cerrarCarrito() {

    document.getElementById(
        "ventanaCarrito"
    ).style.display = "none";

}


/* ==================================================
   CLIENTE
================================================== */

function guardarCliente() {

    const nombre =
        document.getElementById(
            "nombreCliente"
        ).value.trim();

    const whatsapp =
        document.getElementById(
            "whatsappCliente"
        ).value.trim();

    const recibirAvisos =
        document.getElementById(
            "recibirAvisos"
        ).checked;


    if (!nombre) {

        alert(
            "Por favor escribe tu nombre."
        );

        return;

    }


    if (!whatsapp) {

        alert(
            "Por favor escribe tu número de WhatsApp."
        );

        return;

    }


    const cliente = {

        nombre: nombre,

        whatsapp: whatsapp,

        recibirAvisos:
            recibirAvisos,

        fecha:
            new Date().toLocaleDateString()

    };


    localStorage.setItem(
        "clienteFrutiJhanet",
        JSON.stringify(cliente)
    );


    cerrarCliente();

    alert(
        `¡Bienvenido ${nombre}!`
    );

}


function cerrarCliente() {

    document.getElementById(
        "ventanaCliente"
    ).style.display = "none";

}


/* ==================================================
   ENVIAR PEDIDO A WHATSAPP
================================================== */

function enviarPedidoWhatsApp() {

    if (carrito.length === 0) {

        alert(
            "Primero agrega productos al carrito."
        );

        return;

    }


    const clienteGuardado =
        localStorage.getItem(
            "clienteFrutiJhanet"
        );


    if (!clienteGuardado) {

        document.getElementById(
            "ventanaCliente"
        ).style.display = "flex";

        return;

    }


    const cliente =
        JSON.parse(clienteGuardado);


    let subtotal = 0;

    let mensaje =
        `Hola, quiero realizar un pedido en *Tienda Fruti Jhanet*.\n\n`;


    mensaje +=
        `👤 *Cliente:* ${cliente.nombre}\n`;

    mensaje +=
        `📱 *WhatsApp:* ${cliente.whatsapp}\n\n`;

    mensaje +=
        `🛒 *MI PEDIDO:*\n`;


    carrito.forEach(producto => {

    const totalProducto =
        producto.precio *
        producto.cantidad;

    subtotal += totalProducto;


    mensaje +=
        `\n🍓 *${producto.nombre}*\n`;

    mensaje +=
        `   Tipo: ${producto.tipo}\n`;

    mensaje +=
        `   Precio: Bs ${producto.precio}/${producto.unidad}\n`;

    mensaje +=
        `   Cantidad: ${producto.cantidad} ${producto.unidad}\n`;

    mensaje +=
        `   Subtotal: Bs ${totalProducto}\n`;

});


    let delivery = 0;


    if (
        subtotal >=
        LIMITE_DELIVERY_GRATIS
    ) {

        delivery = 0;

        mensaje +=
            `\n🚚 Delivery: GRATIS`;

    } else {

        delivery = 10;

        mensaje +=
            `\n🚚 Delivery: Bs ${delivery}`;

    }


    const total =
        subtotal + delivery;


    mensaje +=
        `\n\n💰 *Subtotal:* Bs ${subtotal}`;

    mensaje +=
        `\n💰 *TOTAL:* Bs ${total}`;


    mensaje +=
        `\n\nGracias. Espero confirmación de mi pedido.`;


    const url =
        `https://wa.me/${NUMERO_WHATSAPP}?text=`
        +
        encodeURIComponent(mensaje);


    window.open(
        url,
        "_blank"
    );

}


/* ==================================================
   CATEGORÍAS
================================================== */

function filtrarCategoria(categoria) {

    const filtrados =
        productos.filter(
            producto =>
                producto.categoria === categoria
        );

    mostrarProductos(filtrados);

    document.getElementById(
        "productos"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


function mostrarTodos() {

    mostrarProductos(productos);

}


/* ==================================================
   IR A PRODUCTOS
================================================== */

function irAProductos() {

    document.getElementById(
        "productos"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* ==================================================
   AVISO DE PRODUCTO NUEVO
================================================== */

function crearAviso() {

    const producto =
        document.getElementById(
            "productoNuevo"
        ).value.trim();

    const precio =
        document.getElementById(
            "precioNuevo"
        ).value.trim();


    if (!producto) {

        alert(
            "Escribe el nombre del producto."
        );

        return;

    }


    let mensaje =
        `🍊 ¡NUEVO INGRESO EN FRUTI JHANET!\n\n`;

    mensaje +=
        `Ya tenemos *${producto}* disponible. 🍎\n\n`;


    if (precio) {

        mensaje +=
            `💰 Precio: ${precio}\n\n`;

    }


    mensaje +=
        `🚚 Delivery gratis en compras mayores a Bs 100.\n\n`;

    mensaje +=
        `📱 Haz tu pedido por WhatsApp.`;


    localStorage.setItem(
        "ultimoAviso",
        JSON.stringify({

            producto: producto,

            precio: precio,

            mensaje: mensaje

        })
    );


    document.getElementById(
        "textoAviso"
    ).textContent =
        `Ya tenemos ${producto} disponible. ¡Haz tu pedido!`;


    document.getElementById(
        "resultadoAviso"
    ).innerHTML = `

        <div class="resultado-aviso">

            <strong>
                📢 Mensaje preparado:
            </strong>

            <p style="white-space: pre-line; margin-top:15px;">
                ${mensaje}
            </p>

            <br>

            <button
                class="boton-whatsapp"
                onclick="compartirAviso()"
            >
                📱 Compartir aviso por WhatsApp
            </button>

        </div>
    `;

}


function compartirAviso() {

    const guardado =
        localStorage.getItem(
            "ultimoAviso"
        );


    if (!guardado) return;


    const aviso =
        JSON.parse(guardado);


    const url =
        `https://wa.me/?text=`
        +
        encodeURIComponent(
            aviso.mensaje
        );


    window.open(
        url,
        "_blank"
    );

}


function abrirAviso() {

    const guardado =
        localStorage.getItem(
            "ultimoAviso"
        );


    if (guardado) {

        const aviso =
            JSON.parse(guardado);

        alert(
            aviso.mensaje
        );

    } else {

        alert(
            "Todavía no hay una novedad publicada."
        );

    }

}


/* ==================================================
   INICIO
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        mostrarProductos();

        cargarCarrito();


        /*
           Si el cliente ya está registrado,
           no mostramos nuevamente la ventana.
        */

        const cliente =
            localStorage.getItem(
                "clienteFrutiJhanet"
            );


        if (!cliente) {

            setTimeout(() => {

                document.getElementById(
                    "ventanaCliente"
                ).style.display = "flex";

            }, 1000);

        }


        /*
           Cargar último aviso
        */

        const avisoGuardado =
            localStorage.getItem(
                "ultimoAviso"
            );


        if (avisoGuardado) {

            const aviso =
                JSON.parse(avisoGuardado);

            document.getElementById(
                "textoAviso"
            ).textContent =
                `Ya tenemos ${aviso.producto} disponible. ¡Haz tu pedido!`;

        }

    }
);