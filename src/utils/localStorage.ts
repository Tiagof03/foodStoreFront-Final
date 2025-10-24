import type { IUser } from "../types/IUser";

const USER_STORAGE_KEY = "currentUser";

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

/**
 * Elimina el objeto de usuario del localStorage (para el logout).
 */
export function removeUser(): void {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
        console.error("Error al eliminar usuario de localStorage:", e);
    }
}