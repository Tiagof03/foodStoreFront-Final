import type { IProductoReturn } from './IProducto.ts';

// Interfaz del detalle de pedido que regresa del Backend
export interface IDetallePedidoReturn {
    id: number;
    precioUnitario: number;
    subtotal: number;
    cantidad: number;
    productoDto: IProductoReturn;
}