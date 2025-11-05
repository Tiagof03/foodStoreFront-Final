import type {Estado} from './Estado.ts'
import type { IDetallePedido, IDetallePedidoReturn } from './IDetallePedido.ts'

export interface IPedido {
    fecha: String,
    estado: Estado,
    detallesPedido: IDetallePedido[]
}

export interface IPedidoReturn {
    id: Number,
    fecha: String,
    estado: Estado,
    precio: Number,
    detallesPedido: IDetallePedidoReturn[]
}