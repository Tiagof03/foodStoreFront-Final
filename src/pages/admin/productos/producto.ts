import { 
    getAllProducts, 
    getAllCategories, 
    createProduct, 
    updateProductPrice, 
    updateProductCategory, 
    deleteProduct 
} from "../../../service/api.ts"; 
import type { IProducto, IProductoReturn } from "../../../types/IProducto"; 
import type { ICategoriaReturn } from "../../../types/ICategoria";
import {logout } from "../../../utils/auth";

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

const TablaBody = document.querySelector("#tablaProductos tbody") as HTMLTableSectionElement | null; 
const modal = document.getElementById("fondoModal") as HTMLDivElement | null;
const abrirBtn = document.getElementById("btnAbrirFormulario") as HTMLButtonElement | null;
const productForm = document.getElementById("productForm") as HTMLFormElement | null; 

const productIDInput = document.getElementById("product-id") as HTMLInputElement | null; 
const originalNameInput = document.getElementById("original-name") as HTMLInputElement | null; 
const nombreInput = document.getElementById("nombre") as HTMLInputElement | null;
const precioInput = document.getElementById("precio") as HTMLInputElement | null;
const stockInput = document.getElementById("stock") as HTMLInputElement | null;
const imagenUrlInput = document.getElementById("imagenUrl") as HTMLInputElement | null;
const categoriaSelect = document.getElementById("categoriaSelect") as HTMLSelectElement | null;

const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;

const showMessage = (message: string) => {
    alert(message);
};

function closeModal() {
    if (modal) modal.style.display = "none";
    if (productForm) productForm.reset(); 
    if (productIDInput) productIDInput.value = '';
    if (originalNameInput) originalNameInput.value = '';
    llenarTablaProductos();
}

function openModal(isEditMode: boolean = false, product?: IProductoReturn) {
    if (!modal || !modalTitle || !productForm || !productIDInput || !originalNameInput || !nombreInput || !precioInput || !stockInput || !imagenUrlInput || !categoriaSelect) {
        console.error("❌ ERROR CRÍTICO: Faltan uno o más elementos DOM del formulario. Revisa los IDs en tu HTML.");
        showMessage("Error: No se puede cargar el formulario. (Verifica Consola F12)");
        return; 
    }
    if (isEditMode && product) {
        modalTitle.textContent = `Editar Producto: ${product.nombre}`;
        
        productIDInput.value = String(product.id); 
        originalNameInput.value = product.nombre; 
        nombreInput.value = product.nombre;
        precioInput.value = String(product.precio);
        stockInput.value = String(product.stock);
        imagenUrlInput.value = product.src;
        
        setTimeout(() => {
            if (product.categoria) {
                categoriaSelect.value = String(product.categoria.id); 
            }
        }, 50); 
        
    } else {
        modalTitle.textContent = 'Crear Nuevo Producto';
        productForm.reset();
        productIDInput.value = ''; 
        originalNameInput.value = '';
        categoriaSelect.value = "";
    }
    modal.style.display = "flex"; 
}

if (abrirBtn) abrirBtn.onclick = () => openModal(false); 

const cerrarBtn = document.getElementById("btnCerrarFormulario") as HTMLButtonElement | null;
if (cerrarBtn) cerrarBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

const llenarTablaProductos = async () => {
    if (!TablaBody) {
        console.error("❌ Body de tabla (#tablaProductos tbody) no encontrado.");
        return;
    }
    
    const columnCount = 7; 

    try {
        const productos: IProductoReturn[] = await getAllProducts(); 
        TablaBody.innerHTML = ""; 
        productos.forEach((p: IProductoReturn) => {
            const fila = TablaBody.insertRow(); 
            fila.innerHTML = `
                <td>${p.id}</td>
                <td><img class="table-image" src="${p.src}" alt="${p.nombre}" width="30" height="30" style="object-fit: cover;"/></td>
                <td>${p.nombre}</td>
                <td>$${p.precio !== undefined ? p.precio.toFixed(2) : 'N/A'}</td>
                <td>${p.categoria ? p.categoria.nombre : 'Sin Categoría'}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="editarbtn btn-secondary" data-id="${p.id}" data-prod='${JSON.stringify(p)}'>Editar</button>
                    <button class="eliminarbtn btn-danger" data-id="${p.id}">Eliminar</button>
                </td>
            `;
        });
        
    } catch (error) {
        console.error("❌ Error al llenar la tabla. ¿Fallo de API/CORS?", error);
        TablaBody.innerHTML = `<tr><td colspan="${columnCount}">Error al cargar productos. Verifique la conexión con la API (CORS/404).</td></tr>`;
    }
};

if (productForm) {
    productForm.addEventListener("submit", async (e: SubmitEvent) => { 	
        e.preventDefault();
        if (!nombreInput || !precioInput || !stockInput || !imagenUrlInput || !categoriaSelect || !productIDInput) {
            console.error("❌ Fallo en el submit: Faltan inputs necesarios.");
            showMessage("Error interno: Faltan inputs del formulario.");
            return;
        }
        const productId = productIDInput.value ? Number(productIDInput.value) : null;
        const newCategoryId = Number(categoriaSelect.value);
        const precio = Number(precioInput.value);
        const stock = Number(stockInput.value);
        if (!nombreInput.value || !imagenUrlInput.value || isNaN(precio) || isNaN(stock) || stock < 0 || newCategoryId <= 0) {
            showMessage("Por favor, complete todos los campos y asegúrese de que el Precio y Stock sean números válidos y que se seleccione una categoría.");
            return;
        }

        const productoData: IProducto = {
            nombre: nombreInput.value,
            precio: precio,
            stock: stock,
            src: imagenUrlInput.value,
            idCategoria: newCategoryId,
        };
        
        try {
            if (productId) {
                await updateProductPrice(productId, productoData.precio);
                await updateProductCategory(productId, productoData.idCategoria);
                showMessage(`Producto ${productoData.nombre} (ID: ${productId}) actualizado con éxito.`);
            } else {
                await createProduct(productoData);
                showMessage(`Producto ${productoData.nombre} creado con éxito.`);
            }
            closeModal();
        } catch (error) {
            console.error('❌ Error en el CRUD de producto:', error);
            showMessage('Ocurrió un error en la operación: ' + (error instanceof Error ? error.message : String(error)));
        }
    });
}

if (TablaBody) {
    TablaBody.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('eliminarbtn')) {
            const button = target as HTMLButtonElement;
            const id = Number(button.dataset.id);

            if (isNaN(id) || id <= 0) {
                console.error("❌ ID inválido para eliminar (delegación):", button.dataset.id);
                showMessage("Error al eliminar: ID de producto no encontrado o inválido. (Verifique el Backend)");
                return; 
            }

            if (confirm(`¿Seguro que quieres eliminar el producto con ID ${id}?`)) {
                try {
                    await deleteProduct(id);
                    showMessage(`Producto ID ${id} eliminado con éxito.`);
                    llenarTablaProductos();
                } catch (error) {
                    console.error('❌ Error al eliminar producto:', error);
                    showMessage('Ocurrió un error al eliminar el producto: ' + (error instanceof Error ? error.message : String(error)));
                }
            }
        }
        
        if (target.classList.contains('editarbtn')) {
            const button = target as HTMLButtonElement;
            const prodDataString = button.dataset.prod;
            if (prodDataString) {
                const product: IProductoReturn = JSON.parse(prodDataString);
                openModal(true, product);
            }
        }
    });
}

const cargarCategorias = async () => {
    if (!categoriaSelect) return;
    try {
        const categorias: ICategoriaReturn[] = await getAllCategories();
        categoriaSelect.innerHTML = '<option value="">Seleccione Categoría</option>'; 
        
        categorias.forEach(cat => {
            const option = document.createElement('option');
            if (cat.id) { 
                option.value = String(cat.id); 
                option.textContent = cat.nombre;
                categoriaSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error("❌ Error al cargar las categorías en el select:", error);
        categoriaSelect.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
};

cargarCategorias();
llenarTablaProductos();