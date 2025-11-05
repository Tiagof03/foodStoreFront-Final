import type { ICategoria } from "./ICategoria"
// Interfaz utilizada a la hora de crear un producto
export interface IProducto {
    nombre:string,
    id?:number,
    src:string,
    stock:number,
    descripcion?:string,
    precio:number,
    idCategoria:number
}

// Interfaz utilizada para recibir los datos del backend
export interface IProductoReturn {
    id:number,
    nombre:string,
    src:string,
    precio:Number,
    descripcion?: string,
    stock:number,
    categoria:ICategoria
}