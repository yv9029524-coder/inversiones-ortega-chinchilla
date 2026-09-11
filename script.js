/* =========================================
   INVERSIONES ORTEGA CHINCHILLA
   SCRIPT GENERAL
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
    mostrarCarrito();
    iniciarMenu();
    iniciarAnimaciones();
    iniciarGaleria();
});


/* =========================================
   CARRITO
   ========================================= */

function obtenerCarrito() {

    const carrito = JSON.parse(
        localStorage.getItem("carritoIOC")
    ) || [];

    carrito.forEach(producto => {

        if (!producto.imagen) {
            producto.imagen = obtenerImagenProducto(producto.nombre);
        }

    });

    return carrito;
}


function guardarCarrito(carrito) {

    localStorage.setItem(
        "carritoIOC",
        JSON.stringify(carrito)
    );

    actualizarCarrito();
    mostrarCarrito();
}


/* =========================================
   IMÁGENES DE PRODUCTOS
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
   NOTIFICACIONES
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

    mostrarNotificacion(
        "Producto eliminado del carrito"
    );
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
   CONTADOR DEL CARRITO
   ========================================= */

function actualizarCarrito() {

    const contador =
        document.getElementById("cart-count");

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
        document.getElementById("cart-container");

    const resumen =
        document.getElementById("cart-summary");

    const totalElemento =
        document.getElementById("cart-total");

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
            resumen.style.display = "none";
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
                            alt="${producto.nombre}"
                        >

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
                            onclick="cambiarCantidad('${producto.nombre}', -1)">

                            −

                        </button>

                        <span>
                            ${producto.cantidad}
                        </span>

                        <button
                            type="button"
                            onclick="cambiarCantidad('${producto.nombre}', 1)">

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
                        onclick="eliminarDelCarrito('${producto.nombre}')">

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

        resumen.style.display = "block";

    }
}


/* =========================================
   CHECKOUT
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
   ANIMACIONES PROFESIONALES
   ========================================= */

function iniciarAnimaciones() {

    const elementos =
        document.querySelectorAll(`
            .benefit-card,
            .product-card,
            .service-card,
            .care-card,
            .employee-box,
            .care-title,
            .care-cta,
            .gallery-item,
            .promotion,
            .hero-content,
            .section-title
        `);

    if (!elementos.length) {
        return;
    }

    elementos.forEach((elemento, indice) => {

        elemento.classList.add("scroll-animate");

        elemento.style.setProperty(
            "--animation-delay",
            `${(indice % 5) * 0.08}s`
        );

    });

    if (!("IntersectionObserver" in window)) {

        elementos.forEach(elemento => {
            elemento.classList.add("visible");
        });

        return;
    }

    const observador =
        new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entrada.target
                        );
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

    elementos.forEach(elemento => {
        observador.observe(elemento);
    });


    /* Efecto especial para empleado destacado */

    const empleado =
        document.querySelector(".employee-box");

    if (empleado) {

        empleado.addEventListener(
            "mouseenter",
            () => {

                empleado.classList.add(
                    "employee-hover"
                );

            }
        );

        empleado.addEventListener(
            "mouseleave",
            () => {

                empleado.classList.remove(
                    "employee-hover"
                );

            }
        );
    }


    /* Efecto de movimiento suave para tarjetas */

    const tarjetas =
        document.querySelectorAll(`
            .product-card,
            .service-card,
            .care-card
        `);

    tarjetas.forEach(tarjeta => {

        tarjeta.addEventListener(
            "mouseenter",
            () => {

                tarjeta.classList.add(
                    "card-hover"
                );

            }
        );

        tarjeta.addEventListener(
            "mouseleave",
            () => {

                tarjeta.classList.remove(
                    "card-hover"
                );

            }
        );

    });
}


/* =========================================
   MENÚ PARA CELULAR
   ========================================= */

function iniciarMenu() {

    const menuToggle =
        document.getElementById("menu-toggle");

    const nav =
        document.querySelector(".nav");

    if (!menuToggle || !nav) {
        return;
    }

    menuToggle.addEventListener(
        "click",
        () => {

            nav.classList.toggle("active");

            menuToggle.classList.toggle(
                "active"
            );

        }
    );


    /* Cerrar menú al seleccionar una opción */

    const enlaces =
        nav.querySelectorAll("a");

    enlaces.forEach(enlace => {

        enlace.addEventListener(
            "click",
            () => {

                nav.classList.remove("active");

                menuToggle.classList.remove(
                    "active"
                );

            }
        );

    });
}


/* =========================================
   GALERÍA
   ========================================= */

function iniciarGaleria() {

    const modal =
        document.getElementById("image-modal");

    const imagen =
        document.getElementById(
            "image-modal-content"
        );

    const cerrar =
        document.querySelector(
            ".image-modal-close"
        );

    if (!modal || !imagen || !cerrar) {
        return;
    }


    window.abrirImagen =
        function(src) {

            imagen.src = src;

            modal.classList.add(
                "active"
            );

            document.body.classList.add(
                "modal-open"
            );
        };


    cerrar.addEventListener(
        "click",
        cerrarGaleria
    );


    modal.addEventListener(
        "click",
        (evento) => {

            if (
                evento.target === modal
            ) {

                cerrarGaleria();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (evento) => {

            if (
                evento.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                cerrarGaleria();

            }

        }
    );


    function cerrarGaleria() {

        modal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "modal-open"
        );
    }
}


/* =========================================
   EFECTO SUAVE EN BOTONES
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const botones =
            document.querySelectorAll(
                ".btn-primary, .btn-secondary, button"
            );

        botones.forEach(boton => {

            boton.addEventListener(
                "mousedown",
                () => {

                    boton.classList.add(
                        "button-pressed"
                    );

                }
            );

            boton.addEventListener(
                "mouseup",
                () => {

                    boton.classList.remove(
                        "button-pressed"
                    );

                }
            );

            boton.addEventListener(
                "mouseleave",
                () => {

                    boton.classList.remove(
                        "button-pressed"
                    );

                }
            );

        });

    }
);


/* =========================================
   EVITAR ERRORES CON IMÁGENES
   ========================================= */

document.addEventListener(
    "error",
    (evento) => {

        if (
            evento.target.tagName === "IMG"
        ) {

            evento.target.classList.add(
                "image-error"
            );

        }

    },
    true
);