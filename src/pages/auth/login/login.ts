// /src/pages/auth/login/login.ts (MODIFICADO)

import { loginUser } from "../../../service/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";
import type { ILogin } from "../../../types/IUser";
// import { Rol } from "../../../types/Rol"; // Ya no necesitamos importar el tipo Rol si lo usamos como string literal

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
            const user = await loginUser(payload);
            
            // 1. Guardar el usuario en el almacenamiento local
            saveUser(user);
            
            // 2. Redirigir según el rol. Usamos la cadena literal "admin"
            if (user.rol === "admin") {
                // Ruta para el administrador
                navigateTo("/pages/admin/home.html"); 
            } else {
                // Ruta para el cliente (usuario estándar)
                navigateTo("/pages/client/home.html");
            }

        } catch (error) {
            errorMessageElement.textContent = (error as Error).message;
        }
    });
});