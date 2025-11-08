import type { Rol } from "./Rol";
export interface IUser {
    nombre: string;
    id?: number; 
    idUsuario?: number; 
    apellido: string;
    email: string;
    rol: Rol; 
}

export interface IRegister {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
}


export interface ILogin {
  email: string;
  contrasena: string;
}