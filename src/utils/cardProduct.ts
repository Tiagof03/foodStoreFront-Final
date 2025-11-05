import type { IProductoReturn } from "../types/IProducto"

export function createProductCard(card: IProductoReturn): HTMLElement {
    const tarjeta = document.createElement('div')
    tarjeta.classList.add('tarjeta-producto')
    const img = document.createElement('img')
    const nombre = document.createElement('h4')
    const descripcion = document.createElement('p')
    const precio = document.createElement('span')
    precio.classList.add('price')

    img.src = card.src
    img.alt = card.nombre
    nombre.textContent = card.nombre
    descripcion.textContent = card.descripcion? card.descripcion : 'Sin Descripcion'
    precio.textContent = `$${card.precio}`

    tarjeta.appendChild(img)
    tarjeta.appendChild(nombre)
    tarjeta.appendChild(descripcion)
    tarjeta.appendChild(precio)
    return tarjeta
}