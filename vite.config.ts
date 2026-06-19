import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/shared/api": path.resolve(__dirname, "./src/shared/api/api.ts"),
      "@/widgets/admin-sidebar": path.resolve(
        __dirname,
        "./src/widgets/admin-sidebar/ui/admin-sidebar.tsx",
      ),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
  },
});
