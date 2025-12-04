// Variables globales
let productos = [];
let editandoId = null;

// Cargar productos al iniciar la página
window.onload = function() {
  cargarProductos();
  actualizarVista();
};

// Cargar productos desde localStorage
function cargarProductos() {
  const guardado = localStorage.getItem('ecomarket-productos');
  if (guardado) {
    productos = JSON.parse(guardado);
  }
}

// Guardar productos en localStorage
function guardarEnStorage() {
  localStorage.setItem('ecomarket-productos', JSON.stringify(productos));
}

// Mostrar/Ocultar formulario
function toggleFormulario() {
  const form = document.getElementById('formulario');
  const btnTexto = document.getElementById('btn-texto');
  
  if (form.style.display === 'none') {
    form.style.display = 'block';
    btnTexto.textContent = 'Cancelar';
  } else {
    cancelarForm();
  }
}

// Cancelar y ocultar formulario
function cancelarForm() {
  document.getElementById('formulario').style.display = 'none';
  document.getElementById('btn-texto').textContent = 'Agregar Producto';
  limpiarFormulario();
  editandoId = null;
}

// Limpiar campos del formulario
function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('costo').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('form-titulo').textContent = 'Nuevo Producto';
  document.getElementById('btn-guardar').textContent = 'Agregar Producto';
}

// Guardar producto (nuevo o editado)
function guardarProducto() {
  const nombre = document.getElementById('nombre').value;
  const categoria = document.getElementById('categoria').value;
  const precio = document.getElementById('precio').value;
  const costo = document.getElementById('costo').value;
  const stock = document.getElementById('stock').value;

  // Validar que todos los campos estén completos
  if (!nombre || !categoria || !precio || !costo || !stock) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Crear objeto producto
  const producto = {
    id: editandoId || Date.now(),
    nombre,
    categoria,
    precio: parseFloat(precio),
    costo: parseFloat(costo),
    stock: parseInt(stock),
    vendidos: 0
  };

  // Agregar o editar producto
  if (editandoId) {
    const index = productos.findIndex(p => p.id === editandoId);
    productos[index] = producto;
  } else {
    productos.push(producto);
  }

  guardarEnStorage();
  actualizarVista();
  cancelarForm();
}

// Editar producto existente
function editarProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  // Llenar el formulario con los datos del producto
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('costo').value = producto.costo;
  document.getElementById('stock').value = producto.stock;
  
  // Cambiar título del formulario
  document.getElementById('form-titulo').textContent = 'Editar Producto';
  document.getElementById('btn-guardar').textContent = 'Guardar Cambios';
  document.getElementById('formulario').style.display = 'block';
  document.getElementById('btn-texto').textContent = 'Cancelar';
  
  editandoId = id;
}

// Eliminar producto
function eliminarProducto(id) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    productos = productos.filter(p => p.id !== id);
    guardarEnStorage();
    actualizarVista();
  }
}

// Registrar una venta
function registrarVenta(id) {
  const cantidad = prompt('¿Cuántas unidades se vendieron?');
  if (cantidad && !isNaN(cantidad)) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      producto.stock = Math.max(0, producto.stock - parseInt(cantidad));
      producto.vendidos = (producto.vendidos || 0) + parseInt(cantidad);
      guardarEnStorage();
      actualizarVista();
    }
  }
}

// Actualizar toda la vista
function actualizarVista() {
  actualizarEstadisticas();
  actualizarListaProductos();
}

// Actualizar estadísticas del dashboard
function actualizarEstadisticas() {
  const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
  const totalVentas = productos.reduce((sum, p) => sum + (p.vendidos || 0) * p.precio, 0);
  const totalGanancias = productos.reduce((sum, p) => {
    const ganancia = (p.precio - p.costo) * (p.vendidos || 0);
    return sum + ganancia;
  }, 0);

  document.getElementById('total-stock').textContent = totalStock;
  document.getElementById('total-ventas').textContent = 'S/ ' + totalVentas.toFixed(2);
  document.getElementById('total-ganancias').textContent = 'S/ ' + totalGanancias.toFixed(2);
  document.getElementById('total-ganancias').style.color = totalGanancias >= 0 ? '#059669' : '#dc2626';
}

// Actualizar lista de productos en el DOM
function actualizarListaProductos() {
  const lista = document.getElementById('lista-productos');
  
  // Mostrar mensaje si no hay productos
  if (productos.length === 0) {
    lista.innerHTML = `
      <div class="mensaje-vacio">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem; opacity: 0.5;">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
        <p>No hay productos en el inventario. ¡Agrega tu primer producto!</p>
      </div>
    `;
    return;
  }

  // Generar HTML para cada producto
  lista.innerHTML = productos.map(p => {
    const ganancia = (p.precio - p.costo) * (p.vendidos || 0);
    const stockClase = p.stock < 5 ? 'stock-bajo' : 'stock-ok';
    
    return `
      <div class="tarjeta-producto">
        <div class="producto-info">
          <h3>${p.nombre}</h3>
          <p class="producto-categoria">${p.categoria}</p>
          <p class="stock-info">
            <span style="font-weight: 600;">Stock: </span>
            <span class="${stockClase}" style="font-weight: bold;">${p.stock}</span>
            ${p.stock < 5 ? '<span style="color: #dc2626; margin-left: 0.5rem;">⚠️ Bajo</span>' : ''}
          </p>
        </div>
        <div>
          <p style="font-size: 0.85rem; color: #6b7280;">Precio</p>
          <p style="font-weight: bold; font-size: 1.1rem;">S/ ${p.precio.toFixed(2)}</p>
          <p style="font-size: 0.85rem; color: #6b7280; margin-top: 0.3rem;">Costo: S/ ${p.costo.toFixed(2)}</p>
        </div>
        <div>
          <p style="font-size: 0.85rem; color: #6b7280;">Vendidos</p>
          <p style="font-weight: bold; font-size: 1.1rem;">${p.vendidos || 0}</p>
          <p style="font-size: 0.85rem; color: ${ganancia >= 0 ? '#059669' : '#dc2626'}; margin-top: 0.3rem;">
            Ganancia: S/ ${ganancia.toFixed(2)}
          </p>
        </div>
        <div class="acciones">
          <button class="boton-icono boton-verde" onclick="registrarVenta(${p.id})" title="Registrar Venta">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
          <button class="boton-icono boton-azul" onclick="editarProducto(${p.id})" title="Editar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="boton-icono boton-rojo" onclick="eliminarProducto(${p.id})" title="Eliminar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}
