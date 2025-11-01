import { checkAuhtUser } from "../../../utils/auth.js";
import { logout } from "../../../utils/auth.js";
const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
    logout();
});

const initPage = () => {
    checkAuhtUser(
        "/src/pages/auth/login/login.html", 
        "/src/pages/admin/home/home.html", 
        "USUARIO", 
    );
};
initPage(); 