import { 
    getAllProducts, 
    getAllCategories, 
    createProduct, 
    updateProductPrice, 
    updateProductCategory, 
    deleteProduct 
} from "../../../service/api.ts"; 
// Asegúrate de que las rutas y nombres de tipos sean correctos
import type { IProducto, IProductoReturn } from "../../../types/IProducto"; 
import type { ICategoriaReturn } from "../../../types/ICategoria";
import {logout } from "../../../utils/auth";

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

// ==========================================
// REFERENCIAS DEL DOM (Tipado seguro: Se hacen nullables)
// ==========================================
const TablaBody = document.querySelector("#tablaProductos tbody") as HTMLTableSectionElement | null; 
const modal = document.getElementById("fondoModal") as HTMLDivElement | null;
const abrirBtn = document.getElementById("btnAbrirFormulario") as HTMLButtonElement | null;
const productForm = document.getElementById("productForm") as HTMLFormElement | null; 

// Inputs
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

// ==========================================
// CONTROL DE MODAL Y FORMULARIO
// ==========================================

function closeModal() {
    if (modal) modal.style.display = "none";
    if (productForm) productForm.reset(); 
    // Verificación de null en el cierre
    if (productIDInput) productIDInput.value = '';
    if (originalNameInput) originalNameInput.value = '';
    llenarTablaProductos();
}

function openModal(isEditMode: boolean = false, product?: IProductoReturn) {
    // 🛑 CORRECCIÓN CLAVE: Verificación de TODOS los elementos críticos antes de usarlos
    if (!modal || !modalTitle || !productForm || !productIDInput || !originalNameInput || !nombreInput || !precioInput || !stockInput || !imagenUrlInput || !categoriaSelect) {
        console.error("❌ ERROR CRÍTICO: Faltan uno o más elementos DOM del formulario. Revisa los IDs en tu HTML.");
        showMessage("Error: No se puede cargar el formulario. (Verifica Consola F12)");
        return; 
    }
    
    // El resto del código puede usar los inputs sin 'if (input)' ya que fueron verificados.

    if (isEditMode && product) {
        modalTitle.textContent = `Editar Producto: ${product.nombre}`;
        
        productIDInput.value = String(product.id); 
        originalNameInput.value = product.nombre; 
        nombreInput.value = product.nombre;
        precioInput.value = String(product.precio);
        stockInput.value = String(product.stock);
        imagenUrlInput.value = product.src;
        
        // Espera un ciclo de evento para asegurar que el select se haya llenado
        setTimeout(() => {
            if (product.categoria) {
                // Selecciona la opción usando el ID de la categoría del producto
                categoriaSelect.value = String(product.categoria.id); 
            }
        }, 50); 
        
    } else {
        // MODO CREACIÓN (se resetea el formulario y los valores clave)
        modalTitle.textContent = 'Crear Nuevo Producto';
        productForm.reset();
        productIDInput.value = ''; 
        originalNameInput.value = '';
        // Asegurar que se seleccione la opción por defecto en modo creación
        categoriaSelect.value = "";
    }
    modal.style.display = "flex"; 
}

// Evento para abrir el modal (Botón "Agregar Producto")
if (abrirBtn) abrirBtn.onclick = () => openModal(false); 

// Eventos de control del modal
const cerrarBtn = document.getElementById("btnCerrarFormulario") as HTMLButtonElement | null;
if (cerrarBtn) cerrarBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };


// ==========================================
// CARGA DE DATOS Y LÓGICA DE LA TABLA
// ==========================================

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


// ==========================================
// LÓGICA CRUD (CREATE / UPDATE)
// ==========================================

if (productForm) {
    productForm.addEventListener("submit", async (e: SubmitEvent) => { 	
        e.preventDefault();
        
        // Verificación de existencia de inputs antes de leer su valor
        if (!nombreInput || !precioInput || !stockInput || !imagenUrlInput || !categoriaSelect || !productIDInput) {
             console.error("❌ Fallo en el submit: Faltan inputs necesarios.");
             showMessage("Error interno: Faltan inputs del formulario.");
             return;
        }

        const productId = productIDInput.value ? Number(productIDInput.value) : null;
        
        const newCategoryId = Number(categoriaSelect.value);
        const precio = Number(precioInput.value);
        const stock = Number(stockInput.value);
        
        // ⚠️ CRÍTICO: Validación de campos numéricos y obligatorios
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
                 // Lógica de Actualización: Solo editamos precio y categoría según tu Backend
                 await updateProductPrice(productId, productoData.precio);
                 await updateProductCategory(productId, productoData.idCategoria);
                 showMessage(`Producto ${productoData.nombre} (ID: ${productId}) actualizado con éxito.`);
             } else {
                 // Lógica de Creación (POST)
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

// ==========================================
// LÓGICA DELEGADA PARA BOTONES (DELETE/EDIT)
// ==========================================
// Maneja los clics en todos los botones de la tabla de forma eficiente.

if (TablaBody) {
    TablaBody.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;

        // --- Lógica para ELIMINAR ---
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
        
        // --- Lógica para EDITAR ---
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

// ==========================================
// INICIALIZACIÓN
// ==========================================

const cargarCategorias = async () => {
    if (!categoriaSelect) return;
    try {
        const categorias: ICategoriaReturn[] = await getAllCategories();
        categoriaSelect.innerHTML = '<option value="">Seleccione Categoría</option>'; 
        
        categorias.forEach(cat => {
            const option = document.createElement('option');
            // Asegurarse de que el ID exista antes de usarlo como valor
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