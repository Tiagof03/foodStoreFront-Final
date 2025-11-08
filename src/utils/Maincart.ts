// /src/utils/cart.ts

import type { IProductoReturn } from '../types/IProducto.js'; 
import type { ICartItem } from '../types/ICart.js';

const CART_STORAGE_KEY = 'shoppingCart';

// Función INTERNA para guardar el carrito
function saveCart(cart: ICartItem[]): void {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage:", e);
    }
}

/**
 * 🔑 EXPORTADO: Carga el carrito desde localStorage.
 */
export function loadCart(): ICartItem[] {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        // Si hay datos, parsearlos.
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        return [];
    }
}

/**
 * 🔑 EXPORTADO: Añade un producto o actualiza su cantidad (con validación de stock).
 */
export function addToCart(product: IProductoReturn, quantity: number): void {
    const cart = loadCart();
    const existingItem = cart.find(item => item.producto.id === product.id);

    if (existingItem) {
        const newQuantity = existingItem.cantidad + quantity;
        
        if (newQuantity > product.stock) {
            alert(`No puedes añadir más. Solo quedan ${product.stock} unidades en stock.`);
            // Limitar la cantidad al stock disponible
            existingItem.cantidad = product.stock; 
        } else {
            existingItem.cantidad = newQuantity;
        }
    } else {
        // Añade el producto nuevo
        if (quantity > product.stock) {
            alert(`No puedes añadir ${quantity} unidades. Solo quedan ${product.stock} en stock. Se añadirá el máximo disponible.`);
            quantity = product.stock;
        }
        if (quantity > 0) {
            cart.push({ producto: product, cantidad: quantity });
        }
    }
    saveCart(cart);
}

/**
 * 🔑 EXPORTADO: Actualiza la cantidad de un ítem (con validación de stock).
 */
export function updateItemQuantity(productId: number, newQuantity: number): void {
    let cart = loadCart();
    const item = cart.find(item => item.producto.id === productId);

    if (item) {
        if (newQuantity <= 0) {
            // Elimina si la cantidad es cero o menos
            cart = cart.filter(p => p.producto.id !== productId);
        } else if (newQuantity > item.producto.stock) {
            alert(`Stock máximo alcanzado: ${item.producto.stock}`);
            item.cantidad = item.producto.stock; // Limitar al máximo
        } else {
            item.cantidad = newQuantity;
        }
    }
    saveCart(cart);
}

/**
 * 🔑 EXPORTADO: Elimina un producto.
 */
export function removeItemFromCart(productId: number): void {
    const cart = loadCart().filter(item => item.producto.id !== productId);
    saveCart(cart);
}

/**
 * 🔑 EXPORTADO: Vacía el carrito.
 */
export function clearCart(): void {
    saveCart([]);
}

/**
 * 🔑 EXPORTADO: Calcula el subtotal del carrito.
 */
export function getCartTotal(): number {
    const cart = loadCart();
    // Usa Number() para asegurar que el precio se interpreta como un número
    return cart.reduce((total, item) => total + (Number(item.producto.precio) * item.cantidad), 0);
}