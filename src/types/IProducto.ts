import type { ICategoria } from "./ICategoria"
// Interfaz utilizada a la hora de crear un producto
export interface IProducto {
    nombre:string,
    //url de imagen a usar del producto
    src:string,
    precio:number,
    idCategoria:number
}

// Interfaz utilizada para recibir los datos del backend
export interface IProductoReturn {
    nombre:string,
    src:string,
    precio:number,
    categoria:ICategoria
}