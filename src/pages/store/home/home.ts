// /src/pages/client/store/home.ts

import { getAllProducts } from '../../../service/api.js'
import { getProductById } from '../../../service/api.js';
import { createProductCard } from '../../../utils/cardProduct.js'
import { checkAuhtUser } from "../../../utils/auth.js";
import { logout } from "../../../utils/auth.js";
import { addToCart } from "../../../utils/Maincart.js"; 
import type { IProductoReturn } from '../../../types/IProducto.js';

const buttonLogout = document.querySelector(".boton-sesion") as HTMLButtonElement | null;
buttonLogout?.addEventListener("click", () => {
    logout();
});

const contProducts = document.getElementById('contProducts') as HTMLElement | null; 
const initPage = () => {
    checkAuhtUser(
        "/src/pages/auth/login/login.html", 
        "/src/pages/admin/home/home.html", 
        "USUARIO", 
    );
};
initPage(); 

const renderProducts = async() => {
    if (!contProducts) {
        console.error("Contenedor de porductos no encontrado.");
        return;
    }
    try {
        const productos: IProductoReturn[] = await getAllProducts()
        contProducts.innerHTML = ""
        productos.forEach((p:IProductoReturn) => {
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

contProducts?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const cardElement = target.closest('.tarjeta-producto') as HTMLElement | null;
    if (!cardElement) return;
    const productId = cardElement.dataset.productId;
    if (!productId) {
        console.error("ID de producto no encontrado en la tarjeta.");
        return;
    }
    
    if (target.classList.contains('add-to-cart-btn')) {
        if (target.hasAttribute('disabled')) {
             e.preventDefault();
             alert("❌ Producto sin stock disponible.");
             return;
        }

        e.preventDefault();
        handleQuickAddToCart(Number(productId));
        return; 
    }
    
    if (cardElement && !target.closest('a')) { 
        window.location.href = `../detail/productDetail.html?id=${productId}`;
    }
});

const handleQuickAddToCart = async (productId: number) => {
    try {
        const productData: IProductoReturn = await getProductById(productId); 
        
        if (productData.stock <= 0) {
            alert(`❌ Lo sentimos, ${productData.nombre} está agotado.`);
            renderProducts(); 
            return;
        }

        addToCart(productData, 1);
        alert(`✅ 1 unidad de ${productData.nombre} añadida al carrito!`);
        
    } catch (error) {
        console.error("Error al agregar producto rápido:", error);
        alert("❌ Error al añadir el producto al carrito. Inténtalo de nuevo.");
    }
}


renderProducts();