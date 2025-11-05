import type { IProducto } from "./IProducto"

export interface IDetallePedido {
    idproducto: Number,
    cantidad: Number
}

export interface IDetallePedidoReturn {
    id: Number,
    producto: IProducto,
    cantidad: Number,
    subtotal: Number
}