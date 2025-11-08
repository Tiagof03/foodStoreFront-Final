// /src/utils/cardProduct.ts (ASUMIDO - DEBES REVISAR ESTE ARCHIVO)

import type { IProductoReturn } from '../types/IProducto.js';

export function createProductCard(product: IProductoReturn): HTMLElement {
    const card = document.createElement('div');
    card.className = 'tarjeta-producto';
    
    // 🛑 CRÍTICO: Adjuntar el ID del producto al contenedor para poder usarlo en home.ts
    card.dataset.productId = String(product.id); 

    // Lógica para mostrar disponibilidad
    const stockBadge = product.stock > 0 
        ? '<div class="badge disponible">Disponible</div>'
        : '<div class="badge agotado">Agotado</div>';

    // Lógica para el botón (solo si hay stock)
    const buttonHtml = product.stock > 0
        ? `<button class="add-to-cart-btn" type="button">Añadir 🛒</button>` // 🛑 El botón debe tener la clase 'add-to-cart-btn'
        : ''; 

    card.innerHTML = `
        <img src="${product.src}" alt="${product.nombre}">
        <h4>${product.nombre}</h4>
        <p>${product.descripcion || 'Sin Descripción'}</p>
        <span class="price">$${Number(product.precio).toFixed(2)}</span>
        
        ${buttonHtml} 
        
        ${stockBadge}
    `;

    return card;
}