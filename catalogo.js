// Funcionalidad completa para el catálogo de productos
document.addEventListener('DOMContentLoaded', function() {
    const categorias = document.querySelectorAll('.categoria');
    const busqueda = document.querySelector('.busqueda input');
    const productos = document.querySelectorAll('.tarjeta-producto-catalogo');
    const botonesAgregar = document.querySelectorAll('.boton-agregar');
    
    // Sistema de filtrado por categorías
    categorias.forEach(categoria => {
        categoria.addEventListener('click', function() {
            // Remover clase activa de todas las categorías
            categorias.forEach(cat => cat.classList.remove('activa'));
            
            // Agregar clase activa a la categoría clickeada
            this.classList.add('activa');
            
            const categoriaSeleccionada = this.getAttribute('data-categoria');
            
            // Filtrar productos
            productos.forEach(producto => {
                const categoriaProducto = producto.getAttribute('data-categoria');
                
                if (categoriaSeleccionada === 'todas' || categoriaProducto === categoriaSeleccionada) {
                    producto.style.display = 'flex';
                } else {
                    producto.style.display = 'none';
                }
            });
        });
    });
    
    // Búsqueda en tiempo real mejorada
    busqueda.addEventListener('input', function() {
        const termino = this.value.toLowerCase();
        const categoriaActiva = document.querySelector('.categoria.activa').getAttribute('data-categoria');
        
        productos.forEach(producto => {
            const nombre = producto.querySelector('.nombre-producto').textContent.toLowerCase();
            const descripcion = producto.querySelector('.descripcion-producto')?.textContent.toLowerCase() || '';
            const categoriaProducto = producto.getAttribute('data-categoria');
            
            const coincideBusqueda = nombre.includes(termino) || descripcion.includes(termino);
            const coincideCategoria = categoriaActiva === 'todas' || categoriaProducto === categoriaActiva;
            
            if (coincideBusqueda && coincideCategoria) {
                producto.style.display = 'flex';
            } else {
                producto.style.display = 'none';
            }
        });
    });
    
    // Agregar productos al carrito
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            if (this.classList.contains('boton-no-disponible')) return;
            
            const tarjetaProducto = this.closest('.tarjeta-producto-catalogo');
            const nombre = tarjetaProducto.querySelector('.nombre-producto').textContent;
            const precioTexto = tarjetaProducto.querySelector('.precio-producto').textContent;
            const precio = parseFloat(precioTexto.replace('S/ ', ''));
            const imagen = tarjetaProducto.querySelector('.imagen-producto').src;
            
            // Agregar al carrito
            agregarAlCarrito({
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
            
            // Efecto visual de confirmación
            this.textContent = '✓ Agregado';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.innerHTML = '<img src="Imagenes/Icono_Cesta.png" alt="Carrito" class="icono-boton"> Agregar al carrito';
                this.style.background = '';
            }, 1500);
        });
    });
    
    function agregarAlCarrito(producto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === producto.nombre);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push(producto);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Mostrar notificación
        mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }
    
    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
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
});

// Agregar CSS para la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);