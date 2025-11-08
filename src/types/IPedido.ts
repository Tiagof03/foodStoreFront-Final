import type { Estado } from './Estado.ts';
import type { IDetallePedidoReturn } from './IDetallePedido.ts';

export interface IDetallePedidoCreate {
    idProducto: number; 
    cantidad: number;
}

export interface IPedidoCreate {
    fecha: string; 
    estado: Estado;
    telefono: string;
    direccion: string;
    metodoPago: string;
    notas?: string;
    usuarioId: number;  
    total: number; 
    detallesPedido: IDetallePedidoCreate[];
}

export interface IPedidoBase {
    fecha: string; 
    estado: Estado;
}

export interface IPedidoReturn extends IPedidoBase {
    id: number; 
    total: number; 
    metodoPago?: string;
    direccionEntrega?: string;
    telefonoContacto?: string;
    detallesPedido: IDetallePedidoReturn[];
}