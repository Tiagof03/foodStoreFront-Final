import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        adminProducts: resolve(__dirname, "src/pages/admin/productos/productos.html"), 
        adminCategories: resolve(__dirname, "src/pages/admin/categorias/categorias.html"),
        adminOrders: resolve(__dirname,"src/pages/admin/orders/orders.html"),
        clientHome: resolve(__dirname, "src/pages/store/home/home.html"),
        clientOrders: resolve(__dirname,"src/pages/client/orders/orders.html")
      },
    },
  },
  base: "./",
});