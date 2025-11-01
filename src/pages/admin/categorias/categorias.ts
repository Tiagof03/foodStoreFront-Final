import { logout } from "../../../utils/auth";
import { 
    getAllCategories, 
    createCategory, 
    updateCategoryName, 
    updateCategoryDescription, 
    deleteCategory 
} from "../../../service/api.ts"; 
// **IMPORTANTE:** He añadido ICategoriaCreate. Debes definirla así en tu archivo de tipos:
import type { ICategoriaReturn, ICategoriaCreate } from "../../../types/ICategoria"; 

const TablaBody = document.querySelector("#tablaCategorias tbody") as HTMLTableSectionElement | null; 
const modal = document.getElementById("fondoModal") as HTMLDivElement | null;
const abrirBtn = document.getElementById("btnAbrirFormulario") as HTMLButtonElement | null;
const categoriaForm = document.getElementById("categoriaForm") as HTMLFormElement | null; 

const categoryIDInput = document.getElementById("category-id") as HTMLInputElement | null; 
const originalNameInput = document.getElementById("original-name") as HTMLInputElement | null; 
const nombreInput = document.getElementById("nombre") as HTMLInputElement | null;
const descripcionInput = document.getElementById("descripcion") as HTMLTextAreaElement | null; 

const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement | null;

const showMessage = (message: string) => {
    alert(message);
};

function closeModal() {
    if (modal) modal.style.display = "none";
    if (categoriaForm) categoriaForm.reset(); 
    if (categoryIDInput) categoryIDInput.value = '';
    if (originalNameInput) originalNameInput.value = '';
    llenarTablaCategorias();
}

function openModal(isEditMode: boolean = false, categoria?: ICategoriaReturn) {
    if (!modal || !modalTitle || !categoryIDInput || !originalNameInput || !nombreInput || !descripcionInput) {
        console.error("❌ ERROR CRÍTICO: Faltan uno o más elementos DOM del formulario. Revisa los IDs en tu HTML.");
        showMessage("Error: No se puede cargar el formulario. (Verifica Consola F12)");
        return; 
    }
    
    if (isEditMode && categoria) {
        modalTitle.textContent = `Editar Categoría: ${categoria.nombre}`;
        
        categoryIDInput.value = String(categoria.id); 
        originalNameInput.value = categoria.nombre; 
        nombreInput.value = categoria.nombre;
        descripcionInput.value = categoria.descripcion;
        
    } else {
        modalTitle.textContent = 'Crear Nueva Categoría';
        if (categoriaForm) categoriaForm.reset();
        categoryIDInput.value = ''; 
        originalNameInput.value = '';
    }
    modal.style.display = "flex"; 
}

if (abrirBtn) abrirBtn.onclick = () => openModal(false);
const cerrarBtn = document.getElementById("btnCerrarFormulario") as HTMLButtonElement | null;
if (cerrarBtn) cerrarBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

const llenarTablaCategorias = async () => {
    if (!TablaBody) {
        console.error("❌ Body de tabla (#tablaCategorias tbody) no encontrado.");
        return;
    }
    
    const columnCount = 4; 

    try {
        const categorias: ICategoriaReturn[] = await getAllCategories(); 
        TablaBody.innerHTML = ""; 

        categorias.forEach((c: ICategoriaReturn) => {
            const fila = TablaBody.insertRow(); 

            const id = c.id || '';
            
            fila.innerHTML = `
                <td>${c.id}</td>
                <td>${c.nombre}</td>
                <td>${c.descripcion}</td>
                <td>
                    <button class="editarbtn btn-secondary" data-id="${id}" data-cat='${JSON.stringify(c)}'>Editar</button>
                    <button class="eliminarbtn btn-danger" data-id="${id}">Eliminar</button>
                </td>
            `;
        });
        
    } catch (error) {
        console.error("❌ Error al llenar la tabla. ¿Fallo de API/CORS?", error);
        TablaBody.innerHTML = `<tr><td colspan="${columnCount}">Error al cargar categorías. Verifique la conexión con la API (CORS/404).</td></tr>`;
    }
};

if (categoriaForm) {
    categoriaForm.addEventListener("submit", async (e: SubmitEvent) => { 
        e.preventDefault();

        if (!categoryIDInput || !nombreInput || !descripcionInput || !originalNameInput) {
            console.error("❌ Fallo en el submit: Faltan inputs necesarios.");
            showMessage("Error interno: Faltan inputs del formulario.");
            return;
        }

        const categoryId = categoryIDInput.value ? Number(categoryIDInput.value) : null;
        const newName = nombreInput.value;
        const newDescription = descripcionInput.value;
        const originalName = originalNameInput.value; 
        
        if (!newName || !newDescription) {
            showMessage("Por favor, complete todos los campos.");
            return;
        }

        const categoriaData: ICategoriaCreate = { 
            nombre: newName,
            descripcion: newDescription,
        };
        
        try {
            if (categoryId) {
                if (newName !== originalName) {
                    await updateCategoryName(categoryId, newName); 
                }
                await updateCategoryDescription(categoryId, newDescription);
                showMessage(`Categoría ${newName} (ID: ${categoryId}) actualizada con éxito.`);
            } else {
                await createCategory(categoriaData);
                showMessage(`Categoría ${newName} creada con éxito.`);
            }
            closeModal();
        } catch (error) {
            console.error('❌ Error en el CRUD de categoría:', error);
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
                showMessage("Error al eliminar: ID de categoría no encontrado o inválido. (Verifique el Backend)");
                return; 
            }

            if (confirm(`¿Seguro que quieres eliminar la categoría con ID ${id}?`)) {
                try {
                    await deleteCategory(id);
                    showMessage(`Categoría ID ${id} eliminada con éxito.`);
                    llenarTablaCategorias();
                } catch (error) {
                    console.error('❌ Error al eliminar categoría:', error);
                    showMessage('Ocurrió un error al eliminar la categoría: ' + (error instanceof Error ? error.message : String(error)));
                }
            }
        }
        if (target.classList.contains('editarbtn')) {
            const button = target as HTMLButtonElement;
            const catDataString = button.dataset.cat;
            if (catDataString) {
                const categoria: ICategoriaReturn = JSON.parse(catDataString); 
                openModal(true, categoria);
            }
        }
    });
}

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
logout();
});
// Inicializar la carga de datos al cargar la página
llenarTablaCategorias();