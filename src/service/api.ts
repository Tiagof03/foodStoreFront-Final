import type { IUser, IRegister, ILogin } from "../types/IUser";
const API_BASE_URL = "http://localhost:8080/usuario"; 

/**
 * Función para manejar la respuesta JSON o un error del servidor.
 * @param response La respuesta de la fetch API.
 * @returns El objeto JSON de la respuesta.
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || `Error HTTP: ${response.status}`);
    }
    return response.json();
}

/**
 * Registra un nuevo usuario en el sistema.
 * @param data Los datos del formulario de registro.
 * @returns El objeto IUser del usuario creado.
 */
export async function registerUser(data: IRegister): Promise<IUser> {
    const response = await fetch(`${API_BASE_URL}/guardar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleResponse<IUser>(response);
}

/**
 * Inicia sesión de un usuario en el sistema.
 * @param data Las credenciales de email y contraseña.
 * @returns El objeto IUser del usuario autenticado.
 */
export async function loginUser(data: ILogin): Promise<IUser> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleResponse<IUser>(response);
}