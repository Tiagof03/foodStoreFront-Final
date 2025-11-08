import { logout, checkAuhtUser } from "../../../utils/auth.ts"; 
import type { Estado } from "../../../types/Estado.ts"; 
import { saveOrder } from "../../../utils/localStorage.ts"; 
import { 
    loadCart, 
    clearCart, 
    updateItemQuantity, 
    removeItemFromCart, 
    getCartTotal
} from "../../../utils/Maincart.ts"; 
import type { ICartItem } from "../../../types/ICart.ts"; 
import { createOrder } from "../../../service/api.ts"; 
import type { IPedidoCreate, IDetallePedidoCreate, IPedidoReturn } from "../../../types/IPedido.ts";
import { loadUser } from "../../../utils/localStorage.ts"; 

checkAuhtUser(
    "/src/pages/auth/login/login.html", 
    "/src/pages/admin/home/home.html", 
    "USUARIO"
);

const carritoItemsContainer = document.querySelector('.carrito-items') as HTMLElement | null;
const resumenSubtotal = document.querySelector('.resumen-line:first-of-type span:last-child') as HTMLElement;
const resumenEnvio = document.querySelector('.resumen-line:nth-of-type(2) span:last-child') as HTMLElement;
const resumenTotal = document.querySelector('.resumen-total span:last-child') as HTMLElement;
const vaciarBtn = document.querySelector('.vaciar') as HTMLButtonElement;

const modal = document.getElementById("pedidoModal") as HTMLElement; 
const checkoutForm = document.getElementById("checkoutForm") as HTMLFormElement; 
const telefonoInput = document.getElementById("telefono") as HTMLInputElement;
const direccionInput = document.getElementById("direccion") as HTMLInputElement;
const pagoSelect = document.getElementById("metodoPago") as HTMLSelectElement;
const notasTextarea = document.getElementById("notas") as HTMLTextAreaElement;

const confirmacionModal = document.getElementById("confirmacionModal") as HTMLElement; 
const btnSeguir = document.getElementById("btnSeguirComprando") as HTMLButtonElement;
const btnVer = document.getElementById("btnVerPedidos") as HTMLButtonElement;
const btnIniciarCheckout = document.querySelector(".btn--log--reg") as HTMLButtonElement; 

const buttonLogout = document.querySelector(".boton-sesion") as HTMLButtonElement | null;
buttonLogout?.addEventListener("click", () => logout());

const ENVIO_COSTO = 500; 

function mostrarModalPedido() { modal?.classList.remove("hidden"); }
function cerrarModal() { modal?.classList.add("hidden"); }
function cerrarModalConfirmacion() { confirmacionModal?.classList.add("hidden"); }

btnSeguir?.addEventListener("click", () => {
    cerrarModalConfirmacion();
    window.location.href = "../home/home.html"; 
});

btnVer?.addEventListener("click", () => {
    cerrarModalConfirmacion();
    window.location.href = "../../client/orders/orders.html"; 
});


const getUserId = (): number | null => {
    const user = loadUser();
    if (!user) return null;

    const ids = ['id','idUsuario','usuarioId','userId'];
    for (const key of ids) {
        const value = (user as any)[key];
        if (value) {
            const num = Number(value);
            if (!isNaN(num) && num > 0) return num;
        }
    }
    return null;
};

btnIniciarCheckout?.addEventListener("click", (e) => {
    e.preventDefault();
    const userId = getUserId();
    const cart = loadCart();

    if (!userId) return alert("Debes iniciar sesión para completar el pedido.");
    if (cart.length === 0) return alert("El carrito está vacío.");

    const totalPagarElement = document.getElementById("total-a-pagar") as HTMLElement;
    if (totalPagarElement) {
        totalPagarElement.textContent = `$${(getCartTotal() + ENVIO_COSTO).toFixed(2)}`;
    }
    mostrarModalPedido(); 
});

const handleConfirmOrder = async (e: Event) => {
    e.preventDefault();
    if (!checkoutForm || !telefonoInput || !direccionInput || !pagoSelect) return;

    const userId = getUserId();
    const cart = loadCart();
    const telefono = telefonoInput.value.trim();
    const direccion = direccionInput.value.trim();
    const metodoPago = pagoSelect.value;
    const notas = notasTextarea.value.trim();

    if (!telefono || !direccion || metodoPago === "Seleccione un método") {
        return alert("Completa todos los campos obligatorios.");
    }

    const detallesPedido: IDetallePedidoCreate[] = cart.map(item => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: Number(item.producto.precio),
    }));

    const today = new Date().toISOString().split('T')[0]; 
    const subtotal = getCartTotal(); 
    const total = subtotal + ENVIO_COSTO; 
    const estadoInicial: Estado = "PENDIENTE" as unknown as Estado; 

    const submitButton = checkoutForm.querySelector("button[type='submit']") as HTMLButtonElement;

    const pedidoData: IPedidoCreate = {
        fecha: today,
        estado: estadoInicial,
        usuarioId: userId!,
        telefono,
        direccion,
        metodoPago,
        notas,
        detallesPedido,
        total
    };

    try {
        submitButton.disabled = true;
        cerrarModal();
        const response: IPedidoReturn = await createOrder(pedidoData);
        console.log("Pedido creado con éxito. ID:", response.id);
        const pedidoParaGuardar: IPedidoReturn = {
            ...response, 
            telefonoContacto: telefono,
            direccionEntrega: direccion,
            metodoPago: metodoPago,
            notas: notas || '' 
        } as IPedidoReturn;
        
        saveOrder(pedidoParaGuardar); 
        clearCart();
        initCart();
        confirmacionModal?.classList.remove("hidden");

    } catch (error) {
        console.error("Error en el checkout:", error);
        alert(`❌ Error al confirmar el pedido: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
        submitButton.disabled = false;
    }
};

checkoutForm?.addEventListener("submit", handleConfirmOrder);

function renderCartItems(cart: ICartItem[]) {
    if (!carritoItemsContainer) return;
    carritoItemsContainer.innerHTML = ''; 
    const isCartEmpty = cart.length === 0;

    btnIniciarCheckout.disabled = isCartEmpty;
    vaciarBtn.disabled = isCartEmpty;

    if (isCartEmpty) {
        carritoItemsContainer.innerHTML = '<p class="empty-cart-message">El carrito está vacío.</p>';
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.dataset.productId = String(item.producto.id); 
        const subtotalItem = item.cantidad * Number(item.producto.precio); 

        itemElement.innerHTML = `
            <img src="${item.producto.src}" alt="${item.producto.nombre}" class="carrito-item-img">
            <div class="carrito-item-info">
                <h4>${item.producto.nombre}</h4>
                <p>${item.producto.descripcion || 'Sin descripción'}</p>
                <span class="item-precio">$${Number(item.producto.precio).toFixed(2)} c/u</span>
            </div>
            <div class="item-cantidad">
                <button class="qty-btn" data-action="decrease">-</button>
                <input type="number" min="1" max="${item.producto.stock}" value="${item.cantidad}" class="qty-input" data-id="${item.producto.id}"> 
                <button class="qty-btn" data-action="increase">+</button>
            </div>
            <span class="item-total">$${subtotalItem.toFixed(2)}</span>
            <button class="delete-item" data-id="${item.producto.id}">🗑️</button>
        `;
        carritoItemsContainer.appendChild(itemElement);
    });
}

function actualizarTotales(cart: ICartItem[]) {
    const subtotal = cart.reduce((sum, item) => sum + item.cantidad * Number(item.producto.precio), 0);
    const total = subtotal + ENVIO_COSTO;
    resumenSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    resumenEnvio.textContent = `$${ENVIO_COSTO.toFixed(2)}`;
    resumenTotal.textContent = `$${total.toFixed(2)}`;
}

const initCart = () => {
    const cart = loadCart();
    renderCartItems(cart);
    actualizarTotales(cart);
};

vaciarBtn?.addEventListener('click', () => {
    if (confirm("¿Vaciar el carrito?")) {
        clearCart();
        initCart(); 
    }
});

carritoItemsContainer?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const itemElement = target.closest('.carrito-item') as HTMLElement; 
    if (!itemElement) return;
    const productId = Number(itemElement.dataset.productId); 
    if (isNaN(productId)) return;

    if (target.classList.contains('qty-btn')) {
        const input = itemElement.querySelector('.qty-input') as HTMLInputElement;
        let newQuantity = parseInt(input.value);
        if (target.dataset.action === 'decrease' && newQuantity > 1) newQuantity--;
        else if (target.dataset.action === 'increase') newQuantity++;
        else return;
        updateItemQuantity(productId, newQuantity);
        initCart(); 
    }

    if (target.classList.contains('delete-item')) {
        removeItemFromCart(productId);
        initCart(); 
    }
});

carritoItemsContainer?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains('qty-input')) {
        const productId = Number(target.dataset.id);
        const newQuantity = parseInt(target.value);
        updateItemQuantity(productId, newQuantity);
        initCart();
    }
});

document.addEventListener('DOMContentLoaded', initCart);