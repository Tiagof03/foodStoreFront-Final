import type { IUser } from "../types/IUser";

const USER_STORAGE_KEY = "userSession";

/**
 * Guarda el objeto de usuario autenticado en el localStorage.
 * @param user El objeto IUser a guardar.
 */
export function saveUser(user: IUser): void {
    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
        console.error("Error al guardar usuario en localStorage:", e);
    }
}

/**
 * Recupera el objeto de usuario del localStorage.
 * @returns El objeto IUser si existe, o null.
 */
export function loadUser(): IUser | null {
    try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        return storedUser ? JSON.parse(storedUser) as IUser : null;
    } catch (e) {
        console.error("Error al cargar usuario de localStorage:", e);
        return null;
    }
}
export function removeUser(): void {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
        console.error("Error al eliminar usuario de localStorage:", e);
    }
}
import type { IPedidoReturn } from "../types/IPedido.js";

const PEDIDOS_KEY = "pedidosUsuario";
export function saveOrder(pedido: IPedidoReturn): void {
    try {
        const pedidosJSON = localStorage.getItem(PEDIDOS_KEY);
        const pedidos: IPedidoReturn[] = pedidosJSON ? JSON.parse(pedidosJSON) : [];
        pedidos.push(pedido);
        localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
    } catch (e) {
        console.error("Error al guardar pedido en localStorage:", e);
    }
}
export function getOrders(): IPedidoReturn[] {
    try {
        const pedidosJSON = localStorage.getItem(PEDIDOS_KEY);
        return pedidosJSON ? JSON.parse(pedidosJSON) : [];
    } catch (e) {
        console.error("Error al obtener pedidos de localStorage:", e);
        return [];
    }
}
export function clearOrders(): void {
    try {
        localStorage.removeItem(PEDIDOS_KEY);
    } catch (e) {
        console.error("Error al eliminar pedidos de localStorage:", e);
    }
}