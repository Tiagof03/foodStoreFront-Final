import type { IProductoReturn } from '../types/IProducto.js';

export function createProductCard(product: IProductoReturn): HTMLElement {
    const card = document.createElement('div');
    card.className = 'tarjeta-producto';
    card.dataset.productId = String(product.id); 
    
    const isAvailable = product.stock > 0;
    
    const stockText = isAvailable 
        ? `Stock: ${product.stock} uds.`
        : '¡Agotado!';
        
    const stockClass = isAvailable ? 'stock-disponible' : 'stock-agotado';
    
    const stockInfoHtml = `
        <div class="stock-info">
            <span class="${stockClass}">${stockText}</span>
        </div>
    `;

    const buttonText = isAvailable ? 'Añadir 🛒' : 'Sin Stock';
    const buttonHtml = `
        <button 
            class="add-to-cart-btn" 
            type="button" 
            ${!isAvailable ? 'disabled' : ''}
        >
            ${buttonText}
        </button>
    `;
    
    const stockBadge = isAvailable 
        ? '<div class="badge disponible">Disponible</div>'
        : '<div class="badge agotado">Agotado</div>';
    
    card.innerHTML = `
        <img src="${(product as any).src || 'placeholder.jpg'}" alt="${product.nombre}">
        <h4>${product.nombre}</h4>
        <p>${product.descripcion || 'Sin Descripción'}</p>
        
        ${stockInfoHtml}

        <span class="price">$${Number(product.precio).toFixed(2)}</span>
        
        ${buttonHtml} 
        
        ${stockBadge}
    `;

    return card;
}