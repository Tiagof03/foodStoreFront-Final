import type { IUserLogin } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

const loginForm = document.getElementById("form") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

loginForm.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("NO están todos los datos");
    return;
  }

  const user: IUserLogin = {
    email,
    contrasenia: password,
  };

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      alert("Credenciales inválidas");
      return;
    }

    const data = await response.json();
    const rol: Rol = data.rol;

    if (rol === "admin") {
      navigate("/src/pages/admin/home/home.html");
    } else {
      navigate("/src/pages/client/home/home.html");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Ocurrió un error al iniciar sesión");
  }
});
