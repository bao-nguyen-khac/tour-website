import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        secure: false,
      },
    },
    host: true, // Cho phép truy cập từ mạng ngoài (cần)
    allowedHosts: ['.ngrok-free.app'], // Cho phép mọi subdomain của ngrok
  },
  plugins: [react()],
});
