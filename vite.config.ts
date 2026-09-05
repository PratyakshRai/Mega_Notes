import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isVercel =
  (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env?.VERCEL === "1";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isVercel ? "/" : "/Mega_Notes/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
