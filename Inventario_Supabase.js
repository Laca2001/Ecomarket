// Conexión a Supabase
const supabase = window.supabaseClient;

let editandoId = null; // Para modo edición
let productos = [];    // Lista actual desde la DB

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  actualizarVista();
});

/* ---------------------------
   CARGAR PRODUCTOS DESDE DB
----------------------------*/
async function cargarProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error cargando productos:", error);
    return;
  }

  productos = data;
}

/* ---------------------------
   AGREGAR O EDITAR PRODUCTO
----------------------------*/
async function guardarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const costo = parseFloat(document.getElementById("costo").value);
  const stock = parseInt(document.getElementById("stock").value);

  if (!nombre || !categoria || isNaN(precio) || isNaN(costo) || isNaN(stock)) {
    alert("Por favor completa todos los campos.");
    return;
  }

  let res;

  if (editandoId) {
    res = await supabase
      .from("productos")
      .update({ nombre, categoria, precio, costo, stock })
      .eq("id", editandoId);
  } else {
    res = await supabase
      .from("productos")
      .insert([{ nombre, categoria, precio, costo, stock, vendidos: 0 }]);
  }

  if (res.error) {
    alert("Error al guardar producto.");
    console.error(res.error);
    return;
  }

  alert(editandoId ? "Producto actualizado" : "Producto agregado");

  cancelarForm();
  actualizarVista();
}

/* ---------------------------
       ELIMINAR PRODUCTO
----------------------------*/
async function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminarlo?")) return;

  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    alert("Error eliminando producto");
    return;
  }

  actualizarVista();
}

/* ---------------------------
       REGISTRAR VENTA
----------------------------*/
async function registrarVenta(id) {
  const cant = prompt("¿Cuántas unidades se vendieron?");

  if (!cant || isNaN(cant)) return;

  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const nuevaCantidad = Math.max(0, producto.stock - parseInt(cant));
  const nuevosVendidos = (producto.vendidos || 0) + parseInt(cant);

  const { error } = await supabase
    .from("productos")
    .update({ stock: nuevaCantidad, vendidos: nuevosVendidos })
    .eq("id", id);

  if (error) {
    alert("Error registrando venta");
    return;
  }

  actualizarVista();
}

/* ---------------------------
      MOSTRAR FORMULARIO
----------------------------*/
function toggleFormulario() {
  const form = document.getElementById("formulario");
  const btn = document.getElementById("btn-texto");

  if (form.style.display === "none") {
    form.style.display = "block";
    btn.textContent = "Cancelar";
  } else {
    cancelarForm();
  }
}

function cancelarForm() {
  document.getElementById("formulario").style.display = "none";
  document.getElementById("btn-texto").textContent = "Agregar Producto";
  
  editandoId = null;
  document.getElementById("form-titulo").textContent = "Nuevo Producto";
  document.getElementById("btn-guardar").textContent = "Agregar Producto";

  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("costo").value = "";
  document.getElementById("stock").value = "";
}

/* ---------------------------
      EDITAR PRODUCTO
----------------------------*/
function editarProducto(id) {
  const p = productos.find(prod => prod.id === id);

  if (!p) return;

  editandoId = id;

  document.getElementById("nombre").value = p.nombre;
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("precio").value = p.precio;
  document.getElementById("costo").value = p.costo;
  document.getElementById("stock").value = p.stock;

  document.getElementById("formulario").style.display = "block";
  document.getElementById("form-titulo").textContent = "Editar Producto";
  document.getElementById("btn-guardar").textContent = "Guardar Cambios";
  document.getElementById("btn-texto").textContent = "Cancelar";
}

/* ---------------------------
      ACTUALIZAR ESTADÍSTICAS
----------------------------*/
function actualizarEstadisticas() {
  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
  const totalVentas = productos.reduce((acc, p) => acc + (p.vendidos || 0) * p.precio, 0);
  const totalGanancias = productos.reduce((acc, p) => acc + (p.vendidos || 0) * (p.precio - p.costo), 0);

  document.getElementById("total-stock").textContent = totalStock;
  document.getElementById("total-ventas").textContent = "S/ " + totalVentas.toFixed(2);
  document.getElementById("total-ganancias").textContent = "S/ " + totalGanancias.toFixed(2);
}

/* ---------------------------
     RENDERIZAR PRODUCTOS
----------------------------*/
function actualizarListaProductos() {
  const lista = document.getElementById("lista-productos");

  if (productos.length === 0) {
    lista.innerHTML = `
      <div class="mensaje-vacio">
        <p>No hay productos en el inventario.</p>
      </div>`;
    return;
  }

  lista.innerHTML = productos.map(p => {
    const ganancia = (p.precio - p.costo) * (p.vendidos || 0);
    const stockClase = p.stock < 5 ? "stock-bajo" : "stock-ok";

    return `
      <div class="tarjeta-producto">
        <div class="producto-info">
          <h3>${p.nombre}</h3>
          <p class="producto-categoria">${p.categoria}</p>
          <p class="stock-info">
            Stock: <span class="${stockClase}">${p.stock}</span>
          </p>
        </div>

        <div>
          <p>Precio</p>
          <p><strong>S/ ${p.precio.toFixed(2)}</strong></p>
          <p>Costo: S/ ${p.costo.toFixed(2)}</p>
        </div>

        <div>
          <p>Vendidos</p>
          <p><strong>${p.vendidos || 0}</strong></p>
          <p style="color:${ganancia >= 0 ? '#059669' : '#dc2626'}">
            Ganancia: S/ ${ganancia.toFixed(2)}
          </p>
        </div>

        <div class="acciones">
          <button class="boton-icono boton-verde" onclick="registrarVenta(${p.id})">Venta</button>
          <button class="boton-icono boton-azul" onclick="editarProducto(${p.id})">Editar</button>
          <button class="boton-icono boton-rojo" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </div>
      </div>`;
  }).join("");
}

/* ---------------------------
       ACTUALIZAR TODO
----------------------------*/
async function actualizarVista() {
  await cargarProductos();
  actualizarEstadisticas();
  actualizarListaProductos();
}
