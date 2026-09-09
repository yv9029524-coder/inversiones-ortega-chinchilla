/* =========================================
   INVERSIONES ORTEGA CHINCHILLA
   FUNCIONES GENERALES
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    actualizarCarrito();
    mostrarCarrito();

});


/* =========================================
   OBTENER CARRITO
========================================= */

function obtenerCarrito() {

    const carrito = JSON.parse(
        localStorage.getItem("carritoIOC")
    ) || [];

    carrito.forEach(producto => {

        if (!producto.imagen) {

            producto.imagen =
                obtenerImagenProducto(producto.nombre);

        }

    });

    return carrito;

}


/* =========================================
   OBTENER IMAGEN DEL PRODUCTO
========================================= */

function obtenerImagenProducto(nombre) {

    const imagenes = {

        "Galón de aceite de motor":
            "img/productos/aceite-motor.jpg",

        "Filtro de aceite de motor":
            "img/productos/filtro-aceite.jpg",

        "Filtro de aire acondicionado":
            "img/productos/filtro-aire-acondicionado.jpg",

        "Filtro de diésel":
            "img/productos/filtro-diesel.jpg",

        "Galón de aceite de transmisión automática":
            "img/productos/aceite-transmision.jpg",

        "¼ de aceite de motor":
            "img/productos/aceite-cuarto.jpg"

    };

    return imagenes[nombre] || "";

}


/* =========================================
   GUARDAR CARRITO
========================================= */

function guardarCarrito(carrito) {

    localStorage.setItem(
        "carritoIOC",
        JSON.stringify(carrito)
    );

    actualizarCarrito();
    mostrarCarrito();

}


/* =========================================
   NOTIFICACIÓN
========================================= */

function mostrarNotificacion(mensaje) {

    let notificacion =
        document.getElementById("cart-notification");

    if (!notificacion) {

        notificacion =
            document.createElement("div");

        notificacion.id =
            "cart-notification";

        notificacion.innerHTML = `
            <span>✓</span>
            <span class="cart-notification-text"></span>
        `;

        document.body.appendChild(notificacion);

    }

    const texto =
        notificacion.querySelector(
            ".cart-notification-text"
        );

    texto.textContent = mensaje;

    notificacion.classList.add("show");

    clearTimeout(
        notificacion.notificationTimeout
    );

    notificacion.notificationTimeout =
        setTimeout(() => {

            notificacion.classList.remove("show");

        }, 2500);

}


/* =========================================
   AGREGAR PRODUCTO
========================================= */

function agregarAlCarrito(nombre, precio) {

    const carrito = obtenerCarrito();

    const productoExistente =
        carrito.find(
            producto =>
                producto.nombre === nombre
        );

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen:
                obtenerImagenProducto(nombre)

        });

    }

    guardarCarrito(carrito);

    mostrarNotificacion(
        "Producto agregado al carrito"
    );

}


/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function eliminarDelCarrito(nombre) {

    let carrito = obtenerCarrito();

    carrito = carrito.filter(
        producto =>
            producto.nombre !== nombre
    );

    guardarCarrito(carrito);

}


/* =========================================
   CAMBIAR CANTIDAD
========================================= */

function cambiarCantidad(nombre, cantidad) {

    const carrito = obtenerCarrito();

    const producto =
        carrito.find(
            producto =>
                producto.nombre === nombre
        );

    if (!producto) {

        return;

    }

    producto.cantidad += cantidad;

    if (producto.cantidad <= 0) {

        eliminarDelCarrito(nombre);

        return;

    }

    guardarCarrito(carrito);

}


/* =========================================
   ACTUALIZAR CONTADOR
========================================= */

function actualizarCarrito() {

    const contador =
        document.getElementById(
            "cart-count"
        );

    if (!contador) {

        return;

    }

    const carrito =
        obtenerCarrito();

    const cantidadTotal =
        carrito.reduce(
            (total, producto) =>
                total + producto.cantidad,
            0
        );

    contador.textContent =
        cantidadTotal;

}


/* =========================================
   MOSTRAR CARRITO
========================================= */

function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "cart-container"
        );

    const resumen =
        document.getElementById(
            "cart-summary"
        );

    const totalElemento =
        document.getElementById(
            "cart-total"
        );

    if (!contenedor) {

        return;

    }

    const carrito =
        obtenerCarrito();

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    Tu carrito está vacío
                </h2>

                <p>
                    Todavía no has agregado
                    productos a tu carrito.
                </p>

                <a
                    href="productos.html"
                    class="btn-primary">

                    Ver productos

                </a>

            </div>

        `;

        if (resumen) {

            resumen.style.display =
                "none";

        }

        return;

    }

    let total = 0;

    contenedor.innerHTML =
        carrito.map(producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;

            total += subtotal;

            return `

                <div class="cart-item">

                    <div class="cart-product-image">

                        <img
                            src="${producto.imagen}"
                            alt="${producto.nombre}">

                    </div>

                    <div class="cart-item-info">

                        <h3>
                            ${producto.nombre}
                        </h3>

                        <p>
                            Precio:
                            L ${producto.precio.toLocaleString()}
                        </p>

                    </div>

                    <div class="cart-quantity">

                        <button
                            type="button"
                            onclick="cambiarCantidad(
                                '${producto.nombre}',
                                -1
                            )">

                            −

                        </button>

                        <span>
                            ${producto.cantidad}
                        </span>

                        <button
                            type="button"
                            onclick="cambiarCantidad(
                                '${producto.nombre}',
                                1
                            )">

                            +

                        </button>

                    </div>

                    <div class="cart-subtotal">

                        <strong>
                            L ${subtotal.toLocaleString()}
                        </strong>

                    </div>

                    <button
                        type="button"
                        class="cart-delete"
                        onclick="eliminarDelCarrito(
                            '${producto.nombre}'
                        )">

                        🗑️

                    </button>

                </div>

            `;

        }).join("");

    if (totalElemento) {

        totalElemento.textContent =
            `L ${total.toLocaleString()}`;

    }

    if (resumen) {

        resumen.style.display =
            "block";

    }

}


/* =========================================
   IR AL CHECKOUT
========================================= */

function irAlCheckout() {

    const carrito =
        obtenerCarrito();

    if (carrito.length === 0) {

        mostrarNotificacion(
            "Tu carrito está vacío"
        );

        return;

    }

    window.location.href =
        "checkout.html";

}


/* =========================================
   ANIMACIÓN AL HACER SCROLL
========================================= */

const elementosAnimados =
    document.querySelectorAll(
        ".benefit-card, .product-card, .service-card"
    );

if ("IntersectionObserver" in window) {

    const observador =
        new IntersectionObserver(
            elementos => {

                elementos.forEach(elemento => {

                    if (
                        elemento.isIntersecting
                    ) {

                        elemento.target.classList.add(
                            "visible"
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

    elementosAnimados.forEach(elemento => {

        observador.observe(elemento);

    });

}


/* =========================================
   MENÚ PARA CELULAR
========================================= */

const menuToggle =
    document.getElementById(
        "menu-toggle"
    );

const nav =
    document.querySelector(".nav");

if (menuToggle && nav) {

    menuToggle.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================
   GALERÍA - VER IMAGEN GRANDE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const modal =
            document.getElementById(
                "image-modal"
            );

        const imagen =
            document.getElementById(
                "image-modal-content"
            );

        const cerrar =
            document.querySelector(
                ".image-modal-close"
            );

        if (
            !modal ||
            !imagen ||
            !cerrar
        ) {

            return;

        }

        window.abrirImagen =
            function(src) {

                imagen.src = src;

                modal.classList.add(
                    "active"
                );

            };

        cerrar.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "active"
                );

            }
        );

        modal.addEventListener(
            "click",
            (e) => {

                if (
                    e.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
);