// /src/pages/client/store/home.ts

import { getAllProducts } from '../../../service/api.js'
import { getProductById } from '../../../service/api.js';
import { createProductCard } from '../../../utils/cardProduct.js'
import { checkAuhtUser } from "../../../utils/auth.js";
import { logout } from "../../../utils/auth.js";
import { addToCart } from "../../../utils/Maincart.js"; 
import type { IProductoReturn } from '../../../types/IProducto.js';

// ==========================================
// REFERENCIAS DOM Y LÓGICA DE SESIÓN
// ==========================================
const buttonLogout = document.querySelector(".boton-sesion") as HTMLButtonElement | null;
buttonLogout?.addEventListener("click", () => {
    logout();
});

const contProducts = document.getElementById('contProducts') as HTMLElement | null; // Tipado más estricto

const initPage = () => {
    checkAuhtUser(
        "/src/pages/auth/login/login.html", 
        "/src/pages/admin/home/home.html", 
        "USUARIO", 
    );
};
initPage(); 

// ==========================================
// RENDERIZADO DE PRODUCTOS
// ==========================================

const renderProducts = async() => {
    if (!contProducts) {
        console.error("Contenedor de porductos no encontrado.");
        return;
    }
    try {
        const productos: IProductoReturn[] = await getAllProducts()
        contProducts.innerHTML = ""
        productos.forEach((p:IProductoReturn) => {
            // Asumiendo que createProductCard ahora devuelve un HTMLElement que incluye
            // un enlace de detalle y/o un botón de agregar al carrito.
            const card = createProductCard(p)
            contProducts.appendChild(card)
        })
    } catch (error) {
        console.error("❌ Error al crear las tarjetas. ¿Fallo de API/CORS?", error);
        if (contProducts) {
            contProducts.innerHTML = '<p class="error-message">No se pudieron cargar los productos. Revise el servidor.</p>';
        }
    }
}

// ==========================================
// DELEGACIÓN DE EVENTOS (CLICK en las tarjetas)
// ==========================================

contProducts?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const cardElement = target.closest('.tarjeta-producto') as HTMLElement | null;

    if (!cardElement) return;

    // Obtener el ID del producto que debe estar adjunto al contenedor (cardProduct.ts)
    const productId = cardElement.dataset.productId;
    if (!productId) {
        console.error("ID de producto no encontrado en la tarjeta.");
        return;
    }

    // 1. 🛒 Botón "Agregar al Carrito" (Compra Rápida)
    if (target.classList.contains('add-to-cart-btn')) {
        // Necesitamos tener el objeto producto completo para addToCart.
        // La forma más limpia es obtener la lista de productos y buscarlo.
        
        e.preventDefault(); // Evita que si el botón es un enlace, navegue.
        
        // Ejecutamos una función de manejo de carrito rápido
        handleQuickAddToCart(Number(productId));
        return; // Detenemos la propagación para no ir al detalle.
    }
    
    // 2. 🔍 Click en la Tarjeta (Ver Detalle)
    if (cardElement && !target.closest('a')) { // Si no es un enlace ya existente y no es el botón de carrito
        // Navegar al detalle (solo si no hicimos click en el botón de carrito)
        window.location.href = `../detail/productDetail.html?id=${productId}`;
    }
});

// Función auxiliar para compra rápida
const handleQuickAddToCart = async (productId: number) => {
    try {
        // 🛑 CRÍTICO: Necesitamos obtener los datos del producto (por si acaso no están en memoria)
        // Usar la función que ya tenemos: getProductById (asumimos que la implementaste)
        // Tendrías que importarla o implementarla en api.ts
        const productData: IProductoReturn = await getProductById(productId); 
        
        // Agregamos una unidad por defecto
        addToCart(productData, 1);
        alert(`✅ 1 unidad de ${productData.nombre} añadida al carrito!`);
        
    } catch (error) {
        console.error("Error al agregar producto rápido:", error);
        alert("❌ Error al añadir el producto al carrito. Inténtalo de nuevo.");
    }
}


renderProducts();