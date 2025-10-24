// /src/pages/auth/registro/registro.ts (OPTIMIZADO Y CORREGIDO)

// Reemplazamos las importaciones de bajo nivel por la función centralizada
import { registerAndSaveSession } from "../../../utils/auth"; // <--- Importación clave
import { navigateTo } from "../../../utils/navigate";
import type { IRegister } from "../../../types/IUser"; // Renombrado a IRegisterPayload para claridad

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registro-form") as HTMLFormElement;
    const errorMessageElement = document.getElementById("error-message") as HTMLElement;

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessageElement.textContent = "";

        // ... (Obtención de valores) ...
        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const apellido = (document.getElementById("apellido") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const contrasena = (document.getElementById("contrasena") as HTMLInputElement).value;
        // ...

        if (!nombre || !apellido || !email || !contrasena) {
            errorMessageElement.textContent = "Por favor, complete todos los campos.";
            return;
        }

        const payload: IRegister = { nombre, apellido, email, contrasena };

        try {
            // Llama a la función centralizada que hace la API y guarda la sesión
            await registerAndSaveSession(payload); 
            
            // Redirección corregida al home del cliente
            navigateTo("/pages/client/home/home.html"); 

        } catch (error) {
            // Manejo de errores (ej: email ya existe, error de servidor)
            const message = (error as Error).message || "Ocurrió un error en el registro.";
            errorMessageElement.textContent = message;
        }
    });
});