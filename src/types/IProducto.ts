import type { ICategoria } from "./ICategoria"

export interface IProducto {
    nombre:string,
    id?:number,
    src:string,
    stock:number,
    descripcion?:string,
    precio:number,
    idCategoria:number
}

export interface IProductoReturn {
    id:number,
    nombre:string,
    src:string,
    precio: number,
    descripcion?: string,
    stock:number,
    categoria:ICategoria
}