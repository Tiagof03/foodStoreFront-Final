import { checkAuthUser, logout } from "../../../utils/auth";

const buttonLogout = document.getElementById("logoutButton") as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});


const initPage = () => {
  console.log("inicio de pagina");
  checkAuthUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/client/home/home.html",
    "ADMIN"
  );
};
initPage();
