import type { IUser, IRegister, ILogin } from "../types/IUser";
import type { ICategoria, ICategoriaReturn } from "../types/ICategoria";
import type { IProduct, IProductDto } from "../types/IProducto";
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
 * @returns Un array de objetos ICategoria.
 */
export async function getAllCategories(): Promise<ICategoria[]> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/traertodos`);
    return handleResponse<ICategoria[]>(response);
}

/**
 * Crea una nueva categoría.
 * Endpoint Backend: POST /categoria/guardar
 * @param data Los datos de la nueva categoría (nombre, descripcion, urlImagen).
 * @returns El objeto ICategoria creado.
 */
export async function createCategory(data: ICategoriaReturn): Promise<ICategoria> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<ICategoria>(response);
}

/**
 * Actualiza el nombre de una categoría por su nombre actual.
 * Endpoint Backend: PUT /categoria/editarnombre/{nombre}/{nuevoNombre}
 * @param currentName El nombre actual de la categoría.
 * @param newName El nuevo nombre.
 * @returns Mensaje de éxito o error.
 */
export async function updateCategoryName(currentName: string, newName: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/editarnombre/${currentName}/${newName}`, {
        method: "PUT",
    });
    // Asumimos que el backend retorna un string de confirmación o un 200/204
    return handleResponse<string>(response); 
}

/**
 * Actualiza la descripción de una categoría por su nombre.
 * Endpoint Backend: PUT /categoria/editardescripcion/{nombre}/{descripcion}
 * @param name El nombre de la categoría a actualizar.
 * @param description La nueva descripción.
 * @returns Mensaje de éxito o error.
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
 * @param name El nombre de la categoría a eliminar.
 * @returns Mensaje de éxito o error.
 */
export async function deleteCategory(name: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_CATEGORIA}/eliminar/${name}`, {
        method: "DELETE",
    });
    // Usamos el texto de la respuesta (ej. "Categoría Eliminada") o un mensaje por defecto.
    return handleResponse<string>(response); 
}


// ===============================================
// MÓDULO DE ADMINISTRACIÓN - PRODUCTOS (CRUD)
// ===============================================

/**
 * [Endpoint Sugerido] Obtiene la lista completa de todos los productos.
 * NOTA: Debes verificar o crear este endpoint en tu backend.
 * @returns Un array de objetos IProduct.
 */
export async function getAllProducts(): Promise<IProduct[]> {
    // Asumiendo un endpoint simple para obtener todos los productos
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/traertodos`); 
    return handleResponse<IProduct[]>(response);
}

/**
 * Crea un nuevo producto.
 * Endpoint Backend: POST /producto/guardar
 * @param data Los datos del nuevo producto.
 * @returns El objeto IProduct creado.
 */
export async function createProduct(data: IProductDto): Promise<IProduct> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return handleResponse<IProduct>(response);
}

/**
 * Actualiza el precio de un producto por su nombre.
 * Endpoint Backend: PUT /producto/editarprecio/{nombre}/{precio}
 * @param name El nombre del producto.
 * @param price El nuevo precio.
 * @returns Mensaje de éxito o error.
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
 * @param name El nombre del producto.
 * @param categoryId El ID de la nueva categoría.
 * @returns Mensaje de éxito o error.
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
 * @param name El nombre del producto a eliminar.
 * @returns Mensaje de éxito o error.
 */
export async function deleteProduct(name: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL_PRODUCTO}/eliminar/${name}`, {
        method: "DELETE",
    });
    return handleResponse<string>(response);
}