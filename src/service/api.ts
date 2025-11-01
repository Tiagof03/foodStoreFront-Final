import type { IUser, IRegister, ILogin } from "../types/IUser";
import type { ICategoria, ICategoriaReturn } from "../types/ICategoria";
import type { IProducto, IProductoReturn } from "../types/IProducto";

// Variables de entorno para las URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/usuario";
const API_BASE_URL_CATEGORIA = import.meta.env.VITE_API_URL_CATEGORIA || "http://localhost:8080/categoria";
const API_BASE_URL_PRODUCTO = import.meta.env.VITE_API_URL_PRODUCTO || "http://localhost:8080/producto";

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
        // Leemos el cuerpo del error que contiene el mensaje de la excepción de Spring Boot
        const errorBody = await response.text();
        throw new Error(errorBody || `Error HTTP: ${response.status}`);
    }
    // Si el servidor devuelve una respuesta exitosa, pero vacía (e.g. un PUT sin body)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    // Si no es JSON (ej: devuelve solo un string de confirmación en el cuerpo)
    return response.text() as Promise<T>;
}

// ==========================================
// USUARIOS (REGISTER / LOGIN)
// ==========================================

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

// ==========================================
// CATEGORÍAS CRUD (AJUSTADO)
// ==========================================

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
    // Validación defensiva para prevenir el error "NaN" en el Backend.
    if (isNaN(id) || id <= 0) {
        throw new Error(`ID de categoría inválido (${id}) para la eliminación.`);
    }
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/eliminar/${id}`, {
        method: "DELETE",
    });
    return handleResponse<string>(response); 
}

// ==========================================
// PRODUCTOS CRUD (AJUSTADO)
// ==========================================

export async function getAllProducts(): Promise<IProductoReturn[]> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/traertodos`); 
    return handleResponse<IProductoReturn[]>(response);
}

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

/**
 * Actualiza la categoría de un producto por su ID.
 * Endpoint Backend: PUT /producto/editarcategoria/{id}/{idCategoria}
 * El tipo categoryId se limita a 'number' para asegurar una URL limpia.
 */
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