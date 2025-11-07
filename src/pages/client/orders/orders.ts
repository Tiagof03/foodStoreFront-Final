const pedidosContainer = document.querySelector('.pedidos-container') as HTMLElement;

const pedidos = [
  {
    id: 1760797178248,
    fecha: "18 de octubre de 2025, 11:19 a.m.",
    estado: "PENDIENTE",
    direccion: "Calle Falsa 123",
    telefono: "123456789",
    metodoPago: "Tarjeta de crédito",
    subtotal: 25500,
    envio: 500,
    detallesPedido: [
      { nombre: "Hamburguesa triple", cantidad: 1, precio: 25000 }
    ]
  },
];

function renderPedidos() {
  if (!pedidosContainer) return;
  pedidosContainer.innerHTML = '';

  pedidos.forEach(pedido => {
    const card = document.createElement('div');
    card.className = 'pedido-card';
    card.innerHTML = `
      <div class="pedido-header">
        <h3>Pedido #ORD-${pedido.id}</h3>
        <span class="estado-pendiente">${pedido.estado}</span>
      </div>
      <p class="pedido-fecha">📅 ${pedido.fecha}</p>
      <ul class="pedido-items">
        ${pedido.detallesPedido.map(p => `<li>${p.nombre} (x${p.cantidad}) $${p.precio}</li>`).join('')}
      </ul>
      <div class="pedido-footer">
        <span class="pedido-productos">${pedido.detallesPedido.length} producto(s)</span>
        <span class="pedido-total">$${pedido.subtotal + pedido.envio}</span>
      </div>
    `;

    pedidosContainer.appendChild(card);
  });
}

// Delegation de eventos para abrir modal
pedidosContainer.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('estado-pendiente')) {
    const card = target.closest('.pedido-card') as HTMLElement;
    const index = Array.from(pedidosContainer.children).indexOf(card);
    abrirModalPedido(pedidos[index]);
  }
});

function abrirModalPedido(pedido: typeof pedidos[0]) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Pedido realizado: ${pedido.fecha}</h3>
      <h4>Información de entrega:</h4>
      <p><strong>Dirección:</strong> ${pedido.direccion}</p>
      <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
      <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
      <h4>Productos:</h4>
      <ul>
        ${pedido.detallesPedido.map(p => `<li>${p.nombre} (x${p.cantidad}) $${p.precio}</li>`).join('')}
      </ul>
      <p><strong>Subtotal:</strong> $${pedido.subtotal}</p>
      <p><strong>Envío:</strong> $${pedido.envio}</p>
      <p><strong>Total:</strong> $${pedido.subtotal + pedido.envio}</p>
      <button class="cerrar-modal">Cerrar</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.cerrar-modal')!.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

document.addEventListener('DOMContentLoaded', renderPedidos);
