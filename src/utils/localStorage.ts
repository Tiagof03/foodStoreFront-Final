import type { IUserLogin, IUserRegistro } from "../types/IUser";
import { navigate } from "./navigate";
import { loginUser, createUser } from "../service/api";

export const saveUserC = (userData: IUserRegistro) => {
  createUser(userData)
    .then((data) => {
      console.log('✅ Usuario guardado en backend:', data);
      localStorage.setItem('userData', JSON.stringify(data)); // guardás el que vuelve del backend
    })
    .catch((err) => {
      console.error('❌ Error al guardar usuario:', err);
    });
};

export const saveUser = (userData: IUserLogin) => {
  loginUser(userData)
    .then((data) => {
      console.log('✅ Usuario guardado en backend:', data);
      localStorage.setItem('userData', JSON.stringify(data)); // guardás el que vuelve del backend
    })
    .catch((err) => {
      console.error('❌ Error al guardar usuario:', err);
    });
};

export const logoutUser = () => {
  localStorage.removeItem("userData");
  navigate("/src/pages/auth/login/login.html");
};
