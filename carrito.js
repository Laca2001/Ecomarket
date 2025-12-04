// Funcionalidad completa para el carrito de compras
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    
    // Botón confirmar pedido
    const botonConfirmar = document.querySelector('.boton-confirmar');
    if (botonConfirmar) {
        botonConfirmar.addEventListener('click', function() {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            
            if (carrito.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            if (confirm('¿Confirmar pedido?')) {
                // Aquí podrías enviar el pedido al servidor
                localStorage.removeItem('carrito');
                alert('¡Pedido confirmado! Será procesado próximamente.');
                window.location.href = 'Cliente.html';
            }
        });
    }
});

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tbody = document.querySelector('.tabla-carrito tbody');
    const carritoVacio = document.querySelector('.carrito-vacio');
    
    if (carrito.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (carritoVacio) carritoVacio.style.display = 'block';
        actualizarResumen(0);
        return;
    }
    
    if (carritoVacio) carritoVacio.style.display = 'none';
    
    let html = '';
    let subtotal = 0;
    
    carrito.forEach((producto, index) => {
        const subtotalProducto = producto.precio * producto.cantidad;
        subtotal += subtotalProducto;
        
        html += `
            <tr>
                <td>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto-carrito">
                </td>
                <td>${producto.nombre}</td>
                <td>
                    <div class="contador-cantidad">
                        <button class="boton-contador" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${producto.cantidad}</span>
                        <button class="boton-contador" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </td>
                <td>S/ ${producto.precio.toFixed(2)}</td>
                <td>S/ ${subtotalProducto.toFixed(2)}</td>
                <td>
                    <button class="boton-eliminar" onclick="eliminarProducto(${index})">
                        <img src="Imagenes/Icono_Eliminar.png" alt="Eliminar" style="width: 16px; height: 16px;">
                    </button>
                </td>
            </tr>
        `;
    });
    
    if (tbody) tbody.innerHTML = html;
    actualizarResumen(subtotal);
}

function cambiarCantidad(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    }
}

function eliminarProducto(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        const nombreProducto = carrito[index].nombre;
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
        
        // Mostrar notificación
        mostrarNotificacionCarrito(`${nombreProducto} eliminado del carrito`);
    }
}

function actualizarResumen(subtotal) {
    const elementoSubtotal = document.querySelector('.fila-resumen:nth-child(1) span:last-child');
    const elementoTotal = document.querySelector('.fila-resumen.total span:last-child');
    
    if (elementoSubtotal) elementoSubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
    if (elementoTotal) elementoTotal.textContent = `S/ ${subtotal.toFixed(2)}`;
}

function mostrarNotificacionCarrito(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}