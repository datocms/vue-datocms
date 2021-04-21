import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pkgJson from "./package.json";

const path = require("path");

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "DatoCMS",
      formats: ["cjs", "es"],
      fileName: "index",
    },
    minify: false,
    rollupOptions: {
      external: [
        ...Object.keys(pkgJson.peerDependencies),
        ...Object.keys(pkgJson.dependencies),
      ],
    },
  },
});
