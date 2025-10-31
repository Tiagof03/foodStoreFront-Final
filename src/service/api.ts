import type { IUser, IRegister, ILogin } from "../types/IUser";
import type { ICategoria, ICategoriaReturn } from "../types/ICategoria";
import type { IProducto, IProductoReturn } from "../types/IProducto";
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
        const errorBody = await response.text();
        throw new Error(errorBody || `Error HTTP: ${response.status}`);
    }
    return response.json();
}

/**
 * Registra un nuevo usuario en el sistema.
 * @param data Los datos del formulario de registro.
 * @returns El objeto IUser del usuario creado.
 */
export async function registerUser(data: IRegister): Promise<IUser> {
    const response = await fetch(`${API_BASE_URL}/guardar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleResponse<IUser>(response);
}

/**
 * Inicia sesión de un usuario en el sistema.
 * @param data Las credenciales de email y contraseña.
 * @returns El objeto IUser del usuario autenticado.
 */
export async function loginUser(data: ILogin): Promise<IUser> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return handleResponse<IUser>(response);
}

// ==================Crud===================//
/**
 * Obtiene la lista completa de todas las categorías.
 * Endpoint Backend: GET /categoria/traertodos
 * @returns Un array de objetos ICategoriaReturn.
 */
export async function getAllCategories(): Promise<ICategoriaReturn[]> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/traertodos`);
    // Corregido: Se espera un array de ICategoriaReturn (con ID)
    return handleResponse<ICategoriaReturn[]>(response);
}

/**
 * Crea una nueva categoría.
 * Endpoint Backend: POST /categoria/guardar
 * @param data Los datos de la nueva categoría (nombre, descripcion).
 * @returns El objeto ICategoriaReturn creado (con ID).
 */
export async function createCategory(data: ICategoria): Promise<ICategoriaReturn> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Corregido: Se envía ICategoria (sin ID)
        body: JSON.stringify(data),
    });
    // Corregido: Se recibe ICategoriaReturn (con ID)
    return handleResponse<ICategoriaReturn>(response);
}

/**
 * Actualiza el nombre de una categoría por su nombre actual.
 * Endpoint Backend: PUT /categoria/editarnombre/{nombre}/{nuevoNombre}
 */
export async function updateCategoryName(currentName: string, newName: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/editarnombre/${currentName}/${newName}`, {
        method: "PUT",
    });
    return handleResponse<string>(response); 
}

/**
 * Actualiza la descripción de una categoría por su nombre.
 * Endpoint Backend: PUT /categoria/editardescripcion/{nombre}/{descripcion}
 */
export async function updateCategoryDescription(name: string, description: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/editardescripcion/${name}/${description}`, {
        method: "PUT",
    });
    return handleResponse<string>(response);
}


/**
 * Elimina una categoría por su nombre.
 * Endpoint Backend: DELETE /categoria/eliminar/{nombre}
 */
export async function deleteCategory(name: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/eliminar/${name}`, {
        method: "DELETE",
    });
    return handleResponse<string>(response); 
}
// ==================Crud Producto===================//
/**
 * Obtiene la lista completa de todos los productos.
 * Endpoint Backend: GET /producto/traertodos
 * @returns Un array de objetos IProductoReturn.
 */
export async function getAllProducts(): Promise<IProductoReturn[]> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/traertodos`); 
    // Corregido: Se espera un array de IProductoReturn (con la categoría anidada)
    return handleResponse<IProductoReturn[]>(response);
}

/**
 * Crea un nuevo producto.
 * Endpoint Backend: POST /producto/guardar
 * @param data Los datos del nuevo producto (nombre, src, precio, idCategoria).
 * @returns El objeto IProductoReturn creado (con la categoría anidada).
 */
export async function createProduct(data: IProducto): Promise<IProductoReturn> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Corregido: Se envía IProducto (con idCategoria)
        body: JSON.stringify(data),
    });
    // Corregido: Se recibe IProductoReturn (con categoría)
    return handleResponse<IProductoReturn>(response);
}

/**
 * Actualiza el precio de un producto por su nombre.
 * Endpoint Backend: PUT /producto/editarprecio/{nombre}/{precio}
 */
export async function updateProductPrice(name: string, price: number): Promise<string> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/editarprecio/${name}/${price}`, {
        method: "PUT",
    });
    return handleResponse<string>(response);
}

/**
 * Actualiza la categoría de un producto por su nombre.
 * Endpoint Backend: PUT /producto/editarcategoria/{nombre}/{idCategoria}
 */
export async function updateProductCategory(name: string, categoryId: number | string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/editarcategoria/${name}/${categoryId}`, {
        method: "PUT",
    });
    return handleResponse<string>(response);
}

/**
 * Elimina un producto por su nombre.
 * Endpoint Backend: DELETE /producto/eliminar/{nombre}
 */
export async function deleteProduct(name: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/eliminar/${name}`, {
        method: "DELETE",
    });
    return handleResponse<string>(response);
}