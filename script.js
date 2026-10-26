let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    if (document.getElementById('lista-carrito-contenedor')) {
        renderizarCarrito();
    }
});

function agregarAlCarrito(nombre, precio) {
    let productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen: 'https://via.placeholder.com/80'
        });
    }
    
    guardarYActualizar();
    alert(`¡${nombre} se agregó al carrito!`);
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    guardarYActualizar();
    renderizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarYActualizar();
    renderizarCarrito();
}

function guardarYActualizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.querySelectorAll('#contador-carrito').forEach(el => {
        el.textContent = totalItems;
    });
}

function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito-contenedor');
    const subtotalEl = document.getElementById('subtotal-carrito');
    const totalEl = document.getElementById('total-carrito');
    
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">Tu carrito está vacío.</p>';
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        return;
    }

    let subtotalGeneral = 0;

    carrito.forEach((item, index) => {
        let subtotalItem = item.precio * item.cantidad;
        subtotalGeneral += subtotalItem;

        let div = document.createElement('div');
        div.className = 'item-carrito';
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="img-producto">
            <div class="info-item">
                <h3>${item.nombre}</h3>
                <p class="precio-unitario">Precio: $${item.precio.toFixed(2)}</p>
            </div>
            <div class="cantidad-item">
                <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
            </div>
            <div class="subtotal-item">$${subtotalItem.toFixed(2)}</div>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">&times;</button>
        `;
        contenedor.appendChild(div);
    });

    subtotalEl.textContent = `$${subtotalGeneral.toFixed(2)}`;
    totalEl.textContent = `$${subtotalGeneral.toFixed(2)}`;
}

function filtrarProductos(categoria) {
    let items = document.querySelectorAll('.producto-item');
    let botones = document.querySelectorAll('.btn-categoria');

    botones.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (categoria === 'todos' || item.classList.contains(categoria)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}
