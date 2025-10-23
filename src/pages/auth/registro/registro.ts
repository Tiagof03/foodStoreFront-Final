import { saveUser } from "../../../utils/localStorage";
import type {IUserRegistro, IUserResponse } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import { createUser } from "../../../service/api"; 

const loginForm = document.getElementById("form") as HTMLFormElement;
const nombreInput = document.getElementById("nombre") as HTMLInputElement;
const apellidoInput = document.getElementById("apellido") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("contraseña") as HTMLInputElement;

loginForm.addEventListener("submit", async (e: SubmitEvent) => { 
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const email = emailInput.value.trim();
    const contrasenia = passwordInput.value;

    if (!email || !contrasenia || !nombre || !apellido) {
        alert("Por favor, completa todos los datos.");
        return;
    }

    const userRegistro: IUserRegistro = {
        nombre,
        apellido,
        email, 
        contrasenia
    };
    
    alert("Registrando...");

    try {
        const userDataResponse: IUserResponse = await createUser(userRegistro);
        alert("¡Registro exitoso!");
        const userToSaveC = {...userDataResponse,
            contrasenia: userRegistro.contrasenia, 
            loggedIn: true, 
        };
        saveUser(userToSaveC);

        if (userDataResponse.rol === "admin") {
            navigate("/src/pages/admin/home/home.html");
        } else { 
            navigate("/src/pages/client/home/home.html");
        }

    } catch (error) {
        console.error("Fallo el registro:", error);
        alert(`Error al registrar usuario: ${error}`);
    }
});