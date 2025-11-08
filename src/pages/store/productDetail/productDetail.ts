// /src/pages/client/store/productDetail.ts

// 🛑 IMPORTACIÓN CORREGIDA: Asumimos que crearás getProductById
import { getProductById } from "../../../service/api.ts"; 
import { addToCart } from "../../../utils/Maincart.ts";
import type { IProductoReturn } from '../../../types/IProducto.js';

// 🛑 CORRECCIÓN DE REFERENCIAS DOM: Usamos las clases y IDs reales del HTML
const mainContainer = document.querySelector('.product-container') as HTMLElement | null; // El contenedor principal
const productTitle = document.querySelector('.product-title') as HTMLElement | null;
const productPrice = document.querySelector('.product-price') as HTMLElement | null;
const discountBadge = document.querySelector('.discount-badge') as HTMLElement | null;
const productDescription = document.querySelector('.product-description') as HTMLElement | null;
const productImg = document.querySelector('.product-image img') as HTMLImageElement | null;

const quantityInput = document.getElementById('quantity') as HTMLInputElement | null; // Usando id="quantity"
const addToCartBtn = document.querySelector('.add-to-cart-btn') as HTMLButtonElement | null;

let currentProduct: IProductoReturn | null = null; 

const getProductIdFromUrl = (): number | null => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id ? Number(id) : null;
};

const renderProductDetail = async () => {
    const productId = getProductIdFromUrl();
    if (!productId || !mainContainer) {
        if (mainContainer) mainContainer.innerHTML = '<h2>Producto no encontrado.</h2>';
        return;
    }

    try {
        // 🛑 CORRECCIÓN CRÍTICA 1: Usar getProductById para el ID específico
        // (Debes implementar getProductById en api.ts)
        currentProduct = await getProductById(productId); 
        
        // 🛑 CORRECCIÓN CRÍTICA 2: Rellenar los elementos HTML existentes
        if (productTitle) productTitle.textContent = currentProduct.nombre;
        // Usamos Number() para asegurar que la propiedad precio (Number) se maneje como number
        if (productPrice) productPrice.textContent = `$${Number(currentProduct.precio).toFixed(2)}`;
        if (discountBadge) discountBadge.textContent = `En Stock ${currentProduct.stock}`;
        if (productDescription) productDescription.textContent = currentProduct.descripcion || 'Sin descripción.';
        if (productImg) {
             productImg.src = currentProduct.src;
             productImg.alt = currentProduct.nombre;
        }

        // Ajustar el input de cantidad y el botón de carrito
        if (quantityInput) {
            quantityInput.value = '1';
            quantityInput.min = '1';
            quantityInput.max = String(currentProduct.stock);
            quantityInput.disabled = currentProduct.stock === 0;
        }
        if (addToCartBtn) {
            addToCartBtn.disabled = currentProduct.stock === 0;
            addToCartBtn.textContent = currentProduct.stock === 0 ? 'Agotado' : 'Agregar al Carrito';
        }

    } catch (error) {
        console.error("Error al cargar detalle del producto:", error);
        if (mainContainer) mainContainer.innerHTML = '<h2>Error al cargar el producto o el servidor.</h2>';
    }
};

// 🛑 Añadir el Event Listener principal para el botón "Agregar al Carrito"
addToCartBtn?.addEventListener('click', () => {
    if (currentProduct && quantityInput) {
        const quantity = parseInt(quantityInput.value);
        
        if (quantity > 0 && quantity <= currentProduct.stock) {
            addToCart(currentProduct, quantity);
            alert(`✅ ${quantity} unidad(es) de ${currentProduct.nombre} añadidas al carrito!`);
        } else if (quantity > currentProduct.stock) {
             alert(`⚠️ Solo hay ${currentProduct.stock} unidades disponibles. Por favor, reduce la cantidad.`);
        } else {
             alert('Por favor, ingresa una cantidad válida (mínimo 1).');
        }
    }
});

// 🛑 Añadir Event Listeners para los botones +/- (ya que eliminamos los onclick del HTML)
const quantityControls = document.querySelector('.quantity-controls');
quantityControls?.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains('qty-btn')) {
        let currentQty = parseInt(quantityInput?.value || '1');
        const maxQty = parseInt(quantityInput?.max || '100');
        
        if (target.textContent === '+' && currentQty < maxQty) {
            currentQty++;
        } else if (target.textContent === '-' && currentQty > 1) {
            currentQty--;
        }
        if (quantityInput) quantityInput.value = String(currentQty);
    }
});


renderProductDetail();