import type { IUserLogin, IUserRegistro, IUserResponse } from "../types/IUser"; 
import { navigate } from "./navigate";
import { loginUser, createUser } from "../service/api";


export const registerAndSaveSession = async (userData: IUserRegistro) => { 
    try {
        const data: IUserResponse = await createUser(userData); 
        console.log('✅ Usuario registrado y sesión guardada:', data);
        localStorage.setItem('userData', JSON.stringify(data)); 
        return data; 
    } catch (err) {
        console.error('❌ Error al registrar usuario:', err);
        throw err; 
    }
};

export const loginAndSaveSession = async (userData: IUserLogin) => {
    try {
        const data: IUserResponse = await loginUser(userData);
        console.log('✅ Inicio de sesión exitoso:', data);
        localStorage.setItem('userData', JSON.stringify(data)); 
        return data;
    } catch (err) {
        console.error('❌ Error al iniciar sesión:', err);
        throw err;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("userData");
    navigate("/src/pages/auth/login/login.html");
};