import { registerUser } from "../../../service/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";
import type { IRegister } from "../../../types/IUser"; 

document.addEventListener("DOMContentLoaded", () => {
    // Estas variables ahora encontrarán sus IDs en el HTML si lo corriges.
    const form = document.getElementById("registro-form") as HTMLFormElement;
    const errorMessageElement = document.getElementById("error-message") as HTMLElement;

    if (!form || !errorMessageElement) return; // Mejor control de nulls

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
            saveUser(user);
            navigateTo("/pages/client/home/home.html"); 
            
        } catch (error) {
            errorMessageElement.textContent = (error as Error).message;
        }
    });
});