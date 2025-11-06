export interface ICartItem {
id: number;
nombre: string;
descripcion?: string;
precio: number;
cantidad: number;
imagen?: string;
disponible?: boolean;
}

export interface ICart {
items: ICartItem[];
subtotal: number;
envio: number;
total: number;
}


const carrito: ICart = {
items: [
    {
    id: 1,
    nombre: "Hamburguesa triple",
    descripcion: "Hamburguesa triple smash",
    precio: 25000,
    cantidad: 1,
    imagen: "https://demo01.menudigital.ar/wp-content/uploads/2022/06/hamburguesa-triple.jpg",
    disponible: true
    }
],
subtotal: 25000,
envio: 500,
total: 25500
};

console.log(carrito);
