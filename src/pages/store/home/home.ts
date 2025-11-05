import { getAllProducts } from '../../../service/api.js'
import { createProductCard } from '../../../utils/cardProduct.js'
import { checkAuhtUser } from "../../../utils/auth.js";
import { logout } from "../../../utils/auth.js";
import type { IProductoReturn } from '../../../types/IProducto.js';
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

const contProducts = document.getElementById('contProducts')

const initPage = () => {
    checkAuhtUser(
        "/src/pages/auth/login/login.html", 
        "/src/pages/admin/home/home.html", 
        "USUARIO", 
    );
};
initPage(); 

const renderProducts = async() => {
    if (!contProducts) {
        console.error("Contenedor de porductos no encontrado.");
        return;
    }
    try {
        const productos: IProductoReturn[] = await getAllProducts()
        contProducts.innerHTML = ""
        productos.forEach((p:IProductoReturn) => {
            const card = createProductCard(p)
            contProducts.appendChild(card)
        })
    } catch (error) {
        console.error("❌ Error al crear las tarjetas. ¿Fallo de API/CORS?", error);
    }
}

renderProducts()