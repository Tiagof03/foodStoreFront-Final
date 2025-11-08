import type { IProductoReturn } from "./IProducto";

export interface ICartItem {
    producto: IProductoReturn; 
    cantidad: number;
}