// /src/types/IUser.ts (Ajustado)

import type { Rol } from "./Rol";

/**
 * Interface para los datos de usuario que vienen después de un LOGIN o REGISTRO exitoso.
 */
export interface IUser {
    nombre: string;
    apellido: string;
    email: string;
    // El rol ahora es el Type Rol
    rol: Rol; 
}

/**
 * Interface para los datos que se envían al backend para un REGISTRO.
 */
export interface IRegister {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
}

/**
 * Interface para los datos que se envían al backend para un LOGIN.
 */
export interface ILogin {
  email: string;
  contrasena: string;
}