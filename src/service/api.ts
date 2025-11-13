// /src/service/api.ts

import type { IUser, IRegister, ILogin } from "../types/IUser";
import type { ICategoria, ICategoriaReturn } from "../types/ICategoria";
import type { IProducto, IProductoReturn } from "../types/IProducto";
import type { IPedidoCreate, IPedidoReturn } from "../types/IPedido"; // 🛑 Asegúrate de tener IPedidoReturn


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/usuario";
const API_BASE_URL_CATEGORIA = import.meta.env.VITE_API_URL_CATEGORIA || "http://localhost:8080/categoria";
const API_BASE_URL_PRODUCTO = import.meta.env.VITE_API_URL_PRODUCTO || "http://localhost:8080/producto";
const API_BASE_URL_PEDIDO = import.meta.env.VITE_API_URL_PEDIDO || "http://localhost:8080/pedido"; 

/**
 * Función para manejar la respuesta JSON o un error del servidor.
 * @param response La respuesta de la fetch API.
 * @returns El objeto JSON de la respuesta.
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
        return {} as T; 
    }
    if (!response.ok) {
        const errorBody = await response.text();
        // Incluimos la URL en el error para facilitar el debug
        throw new Error(errorBody || `Error HTTP: ${response.status} en ${response.url}`); 
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return response.text() as Promise<T>;
}

export async function registerUser(data: IRegister): Promise<IUser> {
    const response = await fetch(`${API_BASE_URL}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return handleResponse<IUser>(response);
}

export async function loginUser(data: ILogin): Promise<IUser> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return handleResponse<IUser>(response);
}


export async function getAllCategories(): Promise<ICategoriaReturn[]> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/traertodos`);
    return handleResponse<ICategoriaReturn[]>(response);
}

export async function createCategory(data: ICategoria): Promise<ICategoriaReturn> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<ICategoriaReturn>(response);
}

export async function updateCategoryName(id: number, newName: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/editarnombre/${id}/${newName}`, {
        method: "PUT",
    });
    return handleResponse<string>(response); 
}

export async function updateCategoryDescription(id: number, description: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/editardescripcion/${id}/${description}`, {
        method: "PUT",
    });
    return handleResponse<string>(response);
}


export async function deleteCategory(id: number): Promise<string> {
    if (isNaN(id) || id <= 0) {
        throw new Error(`ID de categoría inválido (${id}) para la eliminación.`);
    }
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/eliminar/${id}`, {
        method: "DELETE",
    });
    return handleResponse<string>(response); 
}


export async function getAllProducts(): Promise<IProductoReturn[]> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/traertodos`); 
    return handleResponse<IProductoReturn[]>(response);
}

/**
 * Trae un producto por su ID.
 * Endpoint: /producto/traerid/{id}
 */
export const getProductById = async (id: number): Promise<IProductoReturn> => {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/traerid/${id}`); 
    return handleResponse<IProductoReturn>(response);
};

export async function createProduct(data: IProducto): Promise<IProductoReturn> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<IProductoReturn>(response);
}

export async function updateProductPrice(id: number, price: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/editarprecio/${id}/${price}`, {
        method: "PUT",
    });
    return handleResponse<string>(response);
}

export async function updateProductCategory(id: number, categoryId: number): Promise<string> { 
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/editarcategoria/${id}/${categoryId}`, {
        method: "PUT",
    });
    return handleResponse<string>(response);
}

export async function deleteProduct(id: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/eliminar/${id}`, {
        method: "DELETE",
    });
    return handleResponse<string>(response);
}


/**
 * Envía el objeto de Pedido (Carrito) al endpoint de guardado transaccional en el Backend.
 * @param data DTO del pedido con usuarioId e ítems.
 * @returns La respuesta del servidor (generalmente el PedidoDto guardado).
 */
export async function createOrder(data: IPedidoCreate): Promise<any> { 
    const response = await fetch(`${API_BASE_URL_PEDIDO}/guardar`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            // Si usas JWT, aquí iría el 'Authorization'
        },
        body: JSON.stringify(data),
    });

    return handleResponse<any>(response);
}

/**
 * Trae todos los pedidos asociados a un ID de usuario.
 * Endpoint asumido: /pedido/traerporusuario/{idUsuario}
 * @param userId ID del usuario logueado.
 * @returns Array de objetos IPedidoReturn.
 */
export async function getOrdersByUserId(userId: number): Promise<IPedidoReturn[]> {
    const response = await fetch(`${API_BASE_URL_PEDIDO}/traertodosusuario/${userId}`); 
    return handleResponse<IPedidoReturn[]>(response);
}

/**
 * Trae todos los pedidos guardados en la base de datos
 * No requiere parametros
 * @returns Array de objetos IPedidoReturn
*/
export async function getOrders(): Promise<IPedidoReturn[]> {
    const response = await fetch(`${API_BASE_URL_PEDIDO}/traertodos`);
    return handleResponse<IPedidoReturn[]>(response);
}