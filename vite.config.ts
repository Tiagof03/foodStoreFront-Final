import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // ... (otras rutas)
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        
        // ✅ CORRECCIÓN: Cambiado de 'products.html' a 'producto.html'
        adminProducts: resolve(__dirname, "src/pages/admin/productos/productos.html"), 
        adminCategories: resolve(__dirname, "src/pages/admin/categorias/categorias.html"),
        
        clientHome: resolve(__dirname, "src/pages/store/home/home.html"),
      },
    },
  },
  base: "./",
});