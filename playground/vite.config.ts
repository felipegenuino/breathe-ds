import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// BASE=/breathe-ds/ in the GitHub Pages build; "/" locally.
// dedupe: the components live in ../components, outside this folder, so their
// imports (react, lucide-react) resolve from the playground's node_modules.
export default defineConfig({
  base: process.env.BASE ?? "/",
  resolve: { dedupe: ["react", "react-dom", "lucide-react"] },
  plugins: [react(), tailwindcss()],
});
