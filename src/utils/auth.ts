import { navigateTo } from "./navigate";
import { loadUser, removeUser, saveUser } from "./localStorage"; 
import type { Rol } from "../types/Rol"; 
import type { IRegister } from "../types/IUser";
import { registerUser } from "../service/api";
export const logout = () => {
    removeUser(); 
    navigateTo("/src/pages/auth/login/login.html");
};

/**
 * Verifica si el usuario tiene sesión y el rol correcto para acceder a una página.
 * @param loginRoute Ruta a donde redirigir si NO hay sesión.
 * @param forbiddenRoute Ruta a donde redirigir si el rol NO es el requerido (e.g., cliente intenta acceder a admin).
 * @param requiredRole Rol necesario para ver la página.
 */

export const registerAndSaveSession = async (payload: IRegister) => {
    try {
        const user = await registerUser(payload);
        saveUser(user);
        return user;
    } catch (error) {
        throw error; 
    }
};
export const checkAuhtUser = (
    loginPath: string,
    forbiddenPath: string,
    requiredRole: Rol
) => {
    const user = loadUser(); 

    if (!user || !user.rol) { 
        return navigateTo(loginPath); 
    }
    if (user.rol.toLowerCase() !== requiredRole.toLowerCase()) {
        return navigateTo(forbiddenPath); 
    }
};