// /src/pages/auth/registro/registro.ts

import { registerUser } from "../../../service/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";
import type { IRegister } from "../../../types/IUser";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registro-form") as HTMLFormElement;
    const errorMessageElement = document.getElementById("error-message") as HTMLElement;

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessageElement.textContent = "";

        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const apellido = (document.getElementById("apellido") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const contrasena = (document.getElementById("contrasena") as HTMLInputElement).value;

        if (!nombre || !apellido || !email || !contrasena) {
            errorMessageElement.textContent = "Por favor, complete todos los campos.";
            return;
        }

        const payload: IRegister = { nombre, apellido, email, contrasena };

        try {
            const user = await registerUser(payload);
            
            // 1. Guardar el usuario en el almacenamiento local
            saveUser(user);
            
            // 2. Redirigir al usuario (ejemplo: a la página principal del cliente)
            navigateTo("/client/home.html"); 

        } catch (error) {
            // Mostrar error del backend (ej: "El correo ya está registrado")
            errorMessageElement.textContent = (error as Error).message;
        }
    });
});