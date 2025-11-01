// Interfaz utilizada para crear la categoria
export interface ICategoria {
    id?:number,
    nombre:string,
    descripcion:string
}
// Interfaz utilizada para recibir los datos del Backend
export interface ICategoriaReturn {
    id?:number
    nombre:string,
    descripcion:string
}
export interface ICategoriaCreate {
    nombre: string;
    descripcion: string;
}
