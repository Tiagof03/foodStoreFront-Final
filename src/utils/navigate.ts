export const navigateTo = (path: string) => {
    // Inicia la redirección para el navegador
    window.location.replace(path); 
    
    // DETIENE EL SCRIPT INMEDIATAMENTE.
    // Esto es CRÍTICO para romper el bucle infinito.
    throw new Error('Navegación completa: deteniendo script');
};