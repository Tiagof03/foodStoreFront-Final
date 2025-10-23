import type { Rol } from "./Rol";

export interface IUserRegistro {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
}
export interface IUserLogin {
  nombre?: string;
  apellido?: string;
  email: string;
  contrasenia: string;
}
export interface IUserResponse {
  id: number;
  nombre?: string;
  apellido?: string;
  email: string;
  contrasenia?: string;
  rol: Rol;
  loggedIn?: boolean; 
}
