/**
 * Redirige a la ruta especificada usando window.location.href.
 * @param route La ruta a la que se desea navegar (ej: "/pages/client/home.html").
 */
export const navigateTo = (route: string) => {
    window.location.href = route;
};