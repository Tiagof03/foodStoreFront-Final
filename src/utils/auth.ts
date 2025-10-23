import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUser, /*removeUser*/ } from "./localStorage";
import { navigate } from "./navigate";

export const checkAuthUser = (
  redireccion1: string, // a dónde ir si NO está logueado
  redireccion2: string, // a dónde ir si NO tiene el rol correcto
  rol: Rol              // rol necesario para entrar
) => {
  console.log("comienzo de checkeo");
  const userString = getUser();

  if (!userString) {
    console.log("No existe usuario en localStorage");
    navigate(redireccion1);
    return;
  } else {
    const parsedUser: IUser = JSON.parse(userString);
    if (parsedUser.rol !== rol) {
      console.log("Usuario sin el rol necesario");
      navigate(redireccion2);
      return;
    }
  }
  // Si pasa el check, el usuario tiene rol correcto y puede seguir
};
