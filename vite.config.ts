import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Configure SWC to handle older Node.js versions
      swcOptions: {
        jsc: {
          target: "es2015",
          parser: {
            syntax: "typescript",
            tsx: true,
          },
        },
      },
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add build options for better compatibility
  build: {
    target: 'es2015',
    sourcemap: true,
  },
}));