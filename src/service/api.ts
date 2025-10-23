const API_BASE_URL = import.meta.env.VITE_API_URL;

import type { IUserLogin, IUserRegistro, IUserResponse } from "../types/IUser";

export const createUser = async (userData: IUserRegistro): Promise<IUserResponse> => {
    try {
        const urlCrear = `${API_BASE_URL}/guardar/`;
        const response = await fetch(urlCrear, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // Parsear la respuesta JSON
        const data: IUserResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error;
    }
};

export const loginUser = async (userData: IUserLogin): Promise<IUserResponse> => {
    try {
        // 1. Construir la URL completa con las credenciales
        const urlConCredenciales = 
            `${API_BASE_URL}/login/${userData.email}/${userData.contrasenia}`;

        // 2. Usar FETCH con el método GET y sin 'body'
        const response = await fetch(urlConCredenciales, {
            method: "GET", // Cambiado a GET
            headers: {
                // Ya no es estrictamente necesario, pero se puede mantener
                "Content-Type": "application/json", 
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data: IUserResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error al iniciar sesión (INSEGURO):", error);
        throw error;
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/eliminar/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
        },
    });

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
    }
} catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error);
    throw error;
}
};
