import { defineConfig } from "vite";

export default defineConfig({
  hmr: { overlay: false },
  resolve: {
    alias: {
      "@material-ui/icons": "@material-ui/icons/esm",
    },
  },
});
