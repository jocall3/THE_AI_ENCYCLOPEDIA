import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// --- Global Configuration Constants ---
const PROJECT_NAME = 'MyWebApp';
const BASE_PATH = '/';
const DEV_PORT = 3000; // Standard development port
const APP_VERSION = '1.0.0';

/**
 * Generates a standard Vite configuration object.
 * This configuration is designed for a typical web application.
 *
 * @param {object} config - The configuration object provided by Vite, including the current mode.
 * @returns {import('vite').UserConfig} The finalized Vite configuration.
 */
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // --- Plugin Management ---
  const plugins: Plugin[] = [
    react({
      // Standard JSX transformation settings
      include: [/\.tsx?$/, /\.jsx?$/],
      babel: {
        plugins: [],
      },
    }),
  ];

  // --- Environment Variable Definition ---
  const definedEnvironmentVariables = {
    // Map environment variables
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || 'DEFAULT_API_KEY'),
    'process.env.APP_VERSION': JSON.stringify(APP_VERSION),
    'process.env.BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString()),
  };

  // --- Path Resolution ---
  const resolveConfig = {
    // Standard module resolution fields
    mainFields: ['module', 'jsnext:main', 'browser', 'main'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Aliases for common modules
      '@core/state': path.resolve(__dirname, 'src/state/appStore.ts'),
      '@core/api': path.resolve(__dirname, 'src/services/apiService.ts'),
      '@ui/components': path.resolve(__dirname, 'src/components/common/index.ts'),
    },
    // Dedupe common libraries
    dedupe: ['react', 'react-dom'],
  };

  // --- Server Configuration ---
  const serverConfig = {
    port: parseInt(env.PORT || String(DEV_PORT), 10),
    host: '0.0.0.0', // Listen on all interfaces
    // Standard proxy configuration
    proxy: {
      // Example proxy for a backend API
      // '/api': {
      //   target: 'http://localhost:3001',
      //   changeOrigin: true,
      //   secure: false,
      // },
    },
    // Enable hot module replacement
    hmr: {
      protocol: 'ws',
      port: 64321,
      overlay: false,
    },
  };

  // --- Final Configuration Assembly ---
  return {
    // Base path for the application
    base: BASE_PATH,

    server: serverConfig,

    plugins: plugins,

    define: definedEnvironmentVariables,

    resolve: resolveConfig,

    // --- Build Optimization ---
    build: {
      target: 'es2020', // Target modern JavaScript features
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        output: {
          // Standard chunking strategy
          manualChunks(id: string) {
            if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
              return 'vendor_ui_framework';
            }
            if (id.includes('src/modules/')) {
              // Separate feature modules into their own bundles
              const moduleName = id.split('src/modules/')[1].split('/')[0];
              return `module_${moduleName}`;
            }
          },
          entryFileNames: '[name].[hash].js',
          chunkFileNames: 'chunks/[name].[hash].js',
        },
      },
      // Standard chunk size warning limit
      chunkSizeWarningLimit: 1000, // Default limit in KB
    },

    // --- Experimental Features ---
    experimental: {
      // No experimental features enabled by default
    },

    // --- CSS Configuration ---
    css: {
      preprocessorOptions: {
        scss: {
          // Inject global SCSS variables
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/variables.scss')}";`,
        },
      },
      modules: {
        // Standard CSS module naming conventions
        localsConvention: 'camelCaseOnly',
      },
    },
  };
});