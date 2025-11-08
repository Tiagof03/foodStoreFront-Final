import { loginUser } from "../../../service/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";
import type { ILogin, IUser } from "../../../types/IUser"; 

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form") as HTMLFormElement;
    const errorMessageElement = document.getElementById("error-message") as HTMLElement;

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessageElement.textContent = "";

        const email = (document.getElementById("email") as HTMLInputElement).value;
        const contrasena = (document.getElementById("contrasena") as HTMLInputElement).value;

        if (!email || !contrasena) {
            errorMessageElement.textContent = "Por favor, ingrese email y contraseña.";
            return;
        }

        const payload: ILogin = { email, contrasena };

        try {
            const user: IUser = await loginUser(payload);
            
            // 🛑 Mapeo forzado: Si la API devuelve 'idUsuario', lo asignamos a 'id'.
            if (user.idUsuario) {
                 user.id = user.idUsuario;
            } else if ((user as any).userId) {
                 // Soporte para otra posible clave de API
                 user.id = (user as any).userId; 
            }
            
            // CRÍTICO: Si el usuario NO tiene ID después del mapeo, abortamos.
            if (!user.id) { 
                console.error("❌ La ID de usuario (idUsuario o id) no fue proporcionada por la API. Objeto recibido:", user);
                errorMessageElement.textContent = "Error de sesión: ID no recuperada. Por favor, revise la respuesta de su API de login.";
                return; // Detiene el proceso
            }
            
            const userRole = user.rol.toUpperCase();
            saveUser(user);
            
            if (userRole === "ADMIN") {
                navigateTo("/src/pages/admin/home/home.html"); 
            } else if (userRole === "USUARIO") { 
                navigateTo("/src/pages/store/home/home.html"); 
            } else {
                errorMessageElement.textContent = "Rol de usuario desconocido.";
            }
        } catch (error) {
            errorMessageElement.textContent = (error as Error).message;
        }
    });
});