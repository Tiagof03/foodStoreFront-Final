import type { IProductoReturn } from '../types/IProducto.js';

export function createProductCard(product: IProductoReturn): HTMLElement {
    const card = document.createElement('div');
    card.className = 'tarjeta-producto';
    card.dataset.productId = String(product.id); 
    const stockBadge = product.stock > 0 
        ? '<div class="badge disponible">Disponible</div>'
        : '<div class="badge agotado">Agotado</div>';
    const buttonHtml = product.stock > 0
        ? `<button class="add-to-cart-btn" type="button">Añadir 🛒</button>`
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