import type { IProductoReturn } from './IProducto.ts';
export interface IDetallePedidoReturn {
    id: number;
    precioUnitario: number;
    subtotal: number;
    cantidad: number;
    productoDto: IProductoReturn;
}