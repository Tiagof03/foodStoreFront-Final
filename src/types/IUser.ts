// /src/types/IUser.ts (CORREGIDO)

import type { Rol } from "./Rol";

/**
 * Interface para los datos de usuario que vienen después de un LOGIN o REGISTRO exitoso.
 */
export interface IUser {
    nombre: string;
    
    // Propiedad esperada por el código de la app (se asignará en login.ts)
    id?: number; 
    
    // Propiedad real que puede devolver la API (inconsistente)
    idUsuario?: number; 
    
    apellido: string;
    email: string;
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