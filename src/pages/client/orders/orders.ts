// /src/pages/store/orders/orders.ts

import { getOrdersByUserId, editEstado } from '../../../service/api.js' 
import type { IUser } from '../../../types/IUser.js';
import { loadUser } from '../../../utils/localStorage.js';
import type { Estado } from '../../../types/Estado.js'; 
import { logout } from "../../../utils/auth.ts"; 

const buttonLogout = document.querySelector(".boton-sesion") as HTMLButtonElement | null;
buttonLogout?.addEventListener("click", () => {
    logout();
});
interface ProductoDetalleLocal {
    nombre: string;
}

interface DetallePedido {
    cantidad: number;
    precioUnitario: number;
    productoDto: ProductoDetalleLocal; 
}

interface PedidoLocal {
    id: number;
    user: IUser;
    fecha: string;
    estado: string; 
    detallesPedido: DetallePedido[];
    total: number;
    telefonoContacto: string;
    direccionEntrega: string;
    metodoPago: string;
    notas?: string;
}

const pedidosListContainer = document.getElementById("pedidos-list-target") as HTMLElement;
const filtroSelect = document.querySelector(".filtro-select") as HTMLSelectElement;

let allLoadedOrders: PedidoLocal[] = [];

const normalizeEstado = (estado: string) => estado.toUpperCase().replace(/\s/g, "_");

const getEstadoClass = (estado: string): string => {
    switch (normalizeEstado(estado)) {
        case "PENDIENTE":
            return "estado-pendiente";
        case "CONFIRMADO": 
            return "estado-confirmado";
        case "TERMINADO":
            return "estado-entregado";
        case "CANCELADO":
            return "estado-cancelado";
        default:
            return "estado-default";
    }
};
const handleCancelOrder = async (pedidoId: number) => {
    if (!confirm(`¿Estás seguro de que quieres cancelar el Pedido #ORD-${pedidoId}? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        await editEstado(pedidoId, "cancelado" as Estado);
        alert(`✅ Pedido #ORD-${pedidoId} cancelado con éxito.`);
        await loadOrders(); 
    } catch (error) {
        console.error("Error al cancelar el pedido:", error);
        alert("❌ Error al cancelar el pedido. Por favor, intenta de nuevo o contacta a soporte.");
    }
}


const createPedidoCard = (pedido: PedidoLocal): HTMLElement => {
    const card = document.createElement("div");
    card.className = "pedido-card";
    card.dataset.pedidoId = String(pedido.id);
    const detalles = pedido.detallesPedido || [];
    const detallesValidos = detalles.filter(item => item.productoDto && item.productoDto.nombre);
    const totalItems = detallesValidos.reduce((sum, item) => sum + item.cantidad, 0);
    const fecha = new Date(pedido.fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const header = document.createElement("div");
    header.className = "pedido-header";
    const h3 = document.createElement("h3");
    h3.textContent = `Pedido #ORD-${pedido.id}`;
    const spanEstado = document.createElement("span");
    spanEstado.className = getEstadoClass(pedido.estado);
    spanEstado.textContent = pedido.estado.replace(/_/g, " ");

    header.appendChild(h3);
    header.appendChild(spanEstado);

    const fechaP = document.createElement("p");
    fechaP.className = "pedido-fecha";
    fechaP.textContent = `📅 ${fecha}`;

    const ul = document.createElement("ul");
    ul.className = "pedido-items";

    detallesValidos.slice(0, 3).forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.productoDto.nombre} (x${item.cantidad})`;
        ul.appendChild(li);
    });

    if (detallesValidos.length > 3) {
        const li = document.createElement("li");
        li.textContent = `... y ${detallesValidos.length - 3} más.`;
        ul.appendChild(li);
    }

    const footer = document.createElement("div");
    footer.className = "pedido-footer";
    
    const isPending = pedido.estado.toLowerCase() === 'pendiente';
    
    if (isPending) {
        const btnCancel = document.createElement("button");
        btnCancel.className = "btn-cancelar-pedido btn-danger"; 
        btnCancel.textContent = "❌ Cancelar Pedido";
        btnCancel.dataset.pedidoId = String(pedido.id);
        
        footer.appendChild(btnCancel);
    }
    
    const summaryContainer = document.createElement("div");
    summaryContainer.className = "pedido-summary";

    const spanProductos = document.createElement("span");
    spanProductos.className = "pedido-productos";
    spanProductos.textContent = `📦 ${totalItems} producto(s)`;

    const spanTotal = document.createElement("span");
    spanTotal.className = "pedido-total";
    spanTotal.textContent = `$${pedido.total.toFixed(2)}`;

    summaryContainer.appendChild(spanProductos);
    summaryContainer.appendChild(spanTotal);

    footer.appendChild(summaryContainer);


    card.appendChild(header);
    card.appendChild(fechaP);
    card.appendChild(ul);
    card.appendChild(footer);

    return card;
};

const displayOrders = (orders: PedidoLocal[]) => {
    if (!pedidosListContainer) return;

    pedidosListContainer.innerHTML = "";

    if (orders.length === 0) {
        const p = document.createElement("p");
        p.className = "info-message";
        p.textContent = "No se encontraron pedidos.";
        pedidosListContainer.appendChild(p);
        return;
    }

    orders.forEach(pedido => {
        const card = createPedidoCard(pedido);
        pedidosListContainer.appendChild(card);
    });
};

const loadOrders = async () => {
    pedidosListContainer.innerHTML = '<p class="loading-message">Cargando pedidos...</p>';
    const user = loadUser()
    if (!user || !user.id) {
        pedidosListContainer.innerHTML = '<p class="info-message">Por favor, inicia sesión para ver tus pedidos.</p>';
        return;
    }
    let pedidosLocales: PedidoLocal[] = [];
    try {
        const pedidosAPI = await getOrdersByUserId(user.id as number); 
        pedidosLocales = pedidosAPI as PedidoLocal[];
    } catch (err) {
        console.error("Error leyendo pedidos del API", err);
        pedidosLocales = [];
    }
    if (pedidosLocales.length === 0) {
        pedidosListContainer.innerHTML = '<p class="info-message">Aún no tienes pedidos registrados.</p>';
        return;
    }
    const uniqueOrdersMap = new Map<number, PedidoLocal>();
    pedidosLocales.forEach(pedido => {
        uniqueOrdersMap.set(pedido.id, pedido);
    });
    pedidosLocales = Array.from(uniqueOrdersMap.values()).reverse(); 
    allLoadedOrders = pedidosLocales;
    displayOrders(allLoadedOrders);
};

const showPedidoDetails = (pedido: PedidoLocal) => {
    const detalleList = pedido.detallesPedido
        .filter(item => item.productoDto && item.productoDto.nombre) 
        .map(
            item => `<li>${item.productoDto.nombre} x${item.cantidad} = $${(item.precioUnitario * item.cantidad).toFixed(2)}</li>`
        ).join("");

    const modalContent = `
        <div class="modal-content">
        <h3>Pedido #ORD-${pedido.id}</h3>
        <p>Teléfono: ${pedido.telefonoContacto}</p>
        <p>Dirección: ${pedido.direccionEntrega}</p>
        <p>Método de pago: ${pedido.metodoPago}</p>
        ${pedido.notas ? `<p>Notas: ${pedido.notas}</p>` : ""}
        <ul>${detalleList || '<li>No hay detalles de productos válidos.</li>'}</ul>
        <p><strong>Total: $${pedido.total.toFixed(2)}</strong></p>
        <button id="close-modal">Cerrar</button>
        </div>
    `;

    const modal = document.createElement("div");
    modal.id = "pedido-modal";
    modal.className = "modal";
    modal.innerHTML = modalContent;

    document.body.appendChild(modal);

    document.getElementById("close-modal")?.addEventListener("click", () => {
        document.body.removeChild(modal);
    });
};

pedidosListContainer?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains('btn-cancelar-pedido')) {
        const pedidoId = Number(target.dataset.pedidoId);
        if (!isNaN(pedidoId)) {
            handleCancelOrder(pedidoId);
        }
        return; 
    }

    const card = target.closest(".pedido-card") as HTMLElement;
    if (!card) return;

    const pedidoId = Number(card.dataset.pedidoId);
    if (isNaN(pedidoId)) return;

    const selectedPedido = allLoadedOrders.find(p => p.id === pedidoId);
    if (selectedPedido) {
        showPedidoDetails(selectedPedido);
    } else {
        alert("Detalle del pedido no encontrado.");
    }
});

filtroSelect?.addEventListener("change", () => {
    const selectedState = filtroSelect.value;
    const normalizedSelectedState = selectedState.toLowerCase();

    const filteredOrders = (normalizedSelectedState === "todos" || normalizedSelectedState === "")
        ? allLoadedOrders
        : allLoadedOrders.filter(p => p.estado.toLowerCase() === normalizedSelectedState);

    displayOrders(filteredOrders);
});

document.addEventListener("DOMContentLoaded", loadOrders);