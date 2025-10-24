// /src/pages/auth/login/login.ts (MODIFICADO)

import { loginUser } from "../../../service/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo } from "../../../utils/navigate";
import type { ILogin } from "../../../types/IUser";

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
            saveUser(user);
            if (user.rol === "admin") {
                navigateTo("/pages/admin/home.html"); 
            } else {
                navigateTo("/pages/client/home.html");
            }
        } catch (error) {
            errorMessageElement.textContent = (error as Error).message;
        }
    });
});