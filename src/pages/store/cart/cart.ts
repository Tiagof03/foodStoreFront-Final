
const carritoItems = document.querySelector('.carrito-items') as HTMLElement;
const resumenSubtotal = document.querySelector('.resumen-line span:last-child') as HTMLElement;
const resumenEnvio = document.querySelector('.resumen-line:nth-of-type(2) span:last-child') as HTMLElement;
const resumenTotal = document.querySelector('.resumen-total span:last-child') as HTMLElement;
const vaciarBtn = document.querySelector('.vaciar') as HTMLButtonElement;
const modal = document.getElementById("pedidoModal") as HTMLElement;
const btnSeguir = document.getElementById("btnSeguirComprando") as HTMLButtonElement;
const btnVer = document.getElementById("btnVerPedidos") as HTMLButtonElement;


function mostrarModalPedido() {
  modal.classList.remove("hidden");
}


function cerrarModal() {
  modal.classList.add("hidden");
}


btnSeguir.addEventListener("click", () => {
  cerrarModal();
  window.location.href = "/src/pages/store/home/home.html"; // vuelve al home
});

btnVer.addEventListener("click", () => {
  cerrarModal();
  window.location.href = "/src/pages/client/orders/orders.html"; // va a los pedidos
});


const btnConfirmarPedido = document.querySelector(".btn--log--reg");
btnConfirmarPedido?.addEventListener("click", (e) => {
  e.preventDefault();
  mostrarModalPedido();
});



const ENVIO_COSTO = 500;


function actualizarTotales() {
  let subtotal = 0;


  document.querySelectorAll('.carrito-item').forEach(item => {
    const precioTexto = (item.querySelector('.item-precio') as HTMLElement).textContent!;
    const cantidadInput = item.querySelector('.qty-input') as HTMLInputElement;

    const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, '')); 
    const cantidad = parseInt(cantidadInput.value);
    const totalItem = precio * cantidad;

  
    const totalEl = item.querySelector('.item-total') as HTMLElement;
    totalEl.textContent = `$${totalItem.toFixed(2)}`;

    subtotal += totalItem;
  });


  resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  resumenEnvio.textContent = `$${ENVIO_COSTO.toFixed(2)}`;
  resumenTotal.textContent = `$${(subtotal + ENVIO_COSTO).toFixed(2)}`;
}


function eliminarItem(boton: HTMLElement) {
  const item = boton.closest('.carrito-item')!;
  item.remove();
  actualizarTotales();
}


function vaciarCarrito() {
  carritoItems.innerHTML = '';
  actualizarTotales();
}


carritoItems.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  
  if (target.classList.contains('qty-btn') && target.textContent === '-') {
    const input = target.nextElementSibling as HTMLInputElement;
    if (parseInt(input.value) > 1) input.value = String(parseInt(input.value) - 1);
    actualizarTotales();
  }


  if (target.classList.contains('qty-btn') && target.textContent === '+') {
    const input = target.previousElementSibling as HTMLInputElement;
    input.value = String(parseInt(input.value) + 1);
    actualizarTotales();
  }

  
  if (target.classList.contains('delete-item')) {
    eliminarItem(target);
  }
});


vaciarBtn.addEventListener('click', () => {
  vaciarCarrito();
});


actualizarTotales();
