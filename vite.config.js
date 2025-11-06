import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ["react-quill-new", "quill-blot-formatter"],
  },
  resolve: {
    alias: {
      quill: "react-quill-new/node_modules/quill",
    },
  },
});
