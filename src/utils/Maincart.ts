import type { IProductoReturn } from '../types/IProducto.js'; 
import type { ICartItem } from '../types/ICart.js';

const CART_STORAGE_KEY = 'shoppingCart';
function saveCart(cart: ICartItem[]): void {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error("Error al guardar el carrito en localStorage:", e);
    }
}

export function loadCart(): ICartItem[] {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        return [];
    }
}
export function addToCart(product: IProductoReturn, quantity: number): void {
    const cart = loadCart();
    const existingItem = cart.find(item => item.producto.id === product.id);

    if (existingItem) {
        const newQuantity = existingItem.cantidad + quantity;
        
        if (newQuantity > product.stock) {
            alert(`No puedes añadir más. Solo quedan ${product.stock} unidades en stock.`);
            existingItem.cantidad = product.stock; 
        } else {
            existingItem.cantidad = newQuantity;
        }
    } else {
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
export function updateItemQuantity(productId: number, newQuantity: number): void {
    let cart = loadCart();
    const item = cart.find(item => item.producto.id === productId);

    if (item) {
        if (newQuantity <= 0) {
            cart = cart.filter(p => p.producto.id !== productId);
        } else if (newQuantity > item.producto.stock) {
            alert(`Stock máximo alcanzado: ${item.producto.stock}`);
            item.cantidad = item.producto.stock;
        } else {
            item.cantidad = newQuantity;
        }
    }
    saveCart(cart);
}
export function removeItemFromCart(productId: number): void {
    const cart = loadCart().filter(item => item.producto.id !== productId);
    saveCart(cart);
}
export function clearCart(): void {
    saveCart([]);
}
export function getCartTotal(): number {
    const cart = loadCart();
    return cart.reduce((total, item) => total + (Number(item.producto.precio) * item.cantidad), 0);
}