document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;

  // 1. Pedir los productos a la base de datos
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error("Error al cargar productos:", error);
    return;
  }

  console.log("Productos desde Supabase:", productos);

  const contenedor = document.querySelector(".rejilla-catalogo");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  productos.forEach((prod) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto-catalogo");

    tarjeta.innerHTML = `
      <img src="Imagenes/placeholder.png"
           alt="${prod.nombre}"
           class="imagen-producto">

      <div class="info-producto">
        <h3 class="nombre-producto">${prod.nombre}</h3>

        <p class="precio-producto">
          Precio: S/ ${Number(prod.precio).toFixed(2)}
        </p>

        <p class="precio-producto">
          Costo: S/ ${Number(prod.costo).toFixed(2)}
        </p>

        <p class="precio-producto">
          Categoría: ${prod.categoria || "Sin categoría"}
        </p>

        <span class="estado-producto ${prod.stock > 0 ? "disponible" : "agotado"}">
          ${prod.stock > 0 ? "Disponible" : "Agotado"}
        </span>

        <button class="boton boton-producto ${prod.stock > 0 ? "boton-agregar" : "boton-no-disponible"}" 
                ${prod.stock == 0 ? "disabled" : ""}>
          ${prod.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </button>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
});
