import { getOrders, editEstado } from "../../../service/api.ts";
import type { IPedidoReturn } from "../../../types/IPedido.ts"; 
import type { Estado } from "../../../types/Estado.ts";
import { logout } from "../../../utils/auth";

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});
const adminPedidosListContainer = document.getElementById("admin-pedidos-list") as HTMLElement; 
const normalizeEstado = (estado: string) => estado.toLowerCase();

const ESTADOS: Estado[] = ["pendiente", "confirmado", "terminado", "cancelado"] as Estado[];

const getEstadoClass = (estado: string): string => {
    switch (normalizeEstado(estado)) {
        case "pendiente": 
            return "estado-pendiente";
        case "confirmado": 
            return "estado-confirmado";
        case "terminado": 
            return "estado-entregado";
        case "cancelado": 
            return "estado-cancelado";
        default: 
            return "estado-default";
    }
};

async function handleStatusChange(pedidoId: number, newStatus: Estado) {
    if (!confirm(`¿Seguro que deseas cambiar el estado del Pedido #${pedidoId} a ${newStatus.toUpperCase()}? 
    Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        await editEstado(pedidoId, newStatus);
        
        await loadAdminOrders();
        alert(`✅ Estado del pedido #${pedidoId} actualizado a ${newStatus.toUpperCase()}`);
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert(`❌ Error al actualizar el estado del pedido: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
}

function createAdminPedidoCard(pedido: IPedidoReturn): HTMLElement {
    const card = document.createElement("div");
    card.className = "pedido-card admin-card";
    
    const fecha = new Date(pedido.fecha).toLocaleDateString("es-ES", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

    const usuarioInfo = (pedido as any).usuarioDto || pedido.user;
    const clienteNombreCompleto = `${usuarioInfo?.nombre || ''} ${usuarioInfo?.apellido || ''}`.trim();

    const detallesList = pedido.detallesPedido.map(item => 
        `<li>${(item as any).productoDto?.nombre || 'Producto Desconocido'} (x${item.cantidad})</li>`
    ).join('');
    
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-selector';
    
    ESTADOS.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado.toUpperCase(); 
        statusSelect.appendChild(option);
    });
    
    statusSelect.value = normalizeEstado(pedido.estado); 

    statusSelect.addEventListener('change', (e) => {
        const newStatus = (e.target as HTMLSelectElement).value as Estado;
        handleStatusChange(pedido.id, newStatus);
    });
    
    card.innerHTML = `
        <div class="pedido-header">
            <h3>Pedido #ORD-${pedido.id}</h3>
            <span class="${getEstadoClass(pedido.estado)}">${pedido.estado.toUpperCase()}</span>
        </div>
        <div class="pedido-admin-info">
            <p>Cliente: ${clienteNombreCompleto || 'N/A'}</p>
        </div>
        <ul class="pedido-items">${detallesList}</ul>
        <div class="pedido-footer admin-footer">
            <span class="pedido-total">Total: $${pedido.total.toFixed(2)}</span>
            <div class="status-control">
                <label>Cambiar Estado:</label>
            </div>
            <span class="pedido-fecha">${fecha}</span>
        </div>
    `;

    card.querySelector('.status-control')?.appendChild(statusSelect);

    return card;
}

async function loadAdminOrders() {
    if (!adminPedidosListContainer) return;
    adminPedidosListContainer.innerHTML = '<p class="loading-message">Cargando todos los pedidos...</p>';

    try {
        const allOrders: IPedidoReturn[] = await getOrders(); 
        
        adminPedidosListContainer.innerHTML = "";
        if (allOrders.length === 0) {
            adminPedidosListContainer.innerHTML = '<p class="info-message">No hay pedidos registrados.</p>';
            return;
        }

        allOrders.sort((a, b) => b.id - a.id).forEach(pedido => {
            const card = createAdminPedidoCard(pedido);
            adminPedidosListContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando pedidos de admin:", error);
        adminPedidosListContainer.innerHTML = '<p class="error-message">Error al cargar la lista de pedidos. Revisa la consola.</p>';
    }
}

document.addEventListener("DOMContentLoaded", loadAdminOrders);