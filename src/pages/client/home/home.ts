import { checkAuhtUser } from "../../../utils/auth.js";

const initPage = () => {
    console.log("Inicio de página");
    
    try {
        // Al envolverlo, capturas el 'throw' que viene de navigateTo, 
        // lo que detiene el flujo de ejecución del script actual y rompe el bucle.
        checkAuhtUser(
            "/src/pages/auth/login/login.html", 
            "/src/pages/admin/home/home.html", 
            "USUARIO" // Valor corregido
        );
        // Si no hay error, la página carga su contenido aquí.
    } catch (e) {
        // El error es el que lanzamos intencionalmente para detener el script (el throw de navigateTo).
        // No hacemos nada en el catch, la redirección ya ocurrió.
    }
};

initPage();