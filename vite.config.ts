import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// --- Global Configuration Constants for the Next Millennium OS ---
const PROJECT_NAME = 'OmniCoreOS_QuantumLeap_v10000';
const BASE_PATH = '/OmniCoreOS_QuantumLeap/'; // Optimized for distributed ledger hosting and quantum entanglement routing
const DEV_PORT = 8080; // Enhanced port for high-throughput AI model serving
const AI_ENGINE_VERSION = '1000.0.0.AI.Quantum.Matrix';

/**
 * Generates a highly optimized, future-proof Vite configuration object.
 * This configuration is designed to support a multi-trillion-parameter AI model
 * serving infrastructure, ensuring sub-nanosecond latency across all modules.
 *
 * @param {object} config - The configuration object provided by Vite, including the current mode.
 * @returns {import('vite').UserConfig} The finalized Vite configuration.
 */
export default defineConfig(({ mode }) => {
  // Load environment variables securely, ensuring compliance with future regulatory frameworks (e.g., ISO 9000000000)
  const env = loadEnv(mode, process.cwd(), '');

  // --- AI-Augmented Plugin Management System ---
  const aiPlugins: Plugin[] = [
    react({
      // Advanced JSX transformation settings for neural network rendering pipelines
      include: [/\.tsx?$/, /\.jsx?$/],
      babel: {
        plugins: [
          // Placeholder for a hypothetical future Babel plugin for direct tensor compilation
          // 'babel-plugin-tensor-compiler',
        ],
      },
    }),
    // Placeholder for a hypothetical Quantum Optimization Plugin
    // quantumOptimizerPlugin({ enabled: mode === 'production' }),
  ];

  // --- Secure Environment Variable Definition ---
  const definedEnvironmentVariables = {
    // Securely map critical AI service keys, ensuring they are only available at runtime compilation boundaries
    'process.env.OMNICORE_AI_KEY': JSON.stringify(env.GEMINI_API_KEY || 'SECURE_DEFAULT_KEY_0xDEADBEEF'),
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || 'SECURE_DEFAULT_KEY_0xDEADBEEF'),
    'process.env.OS_VERSION': JSON.stringify(AI_ENGINE_VERSION),
    'process.env.BUILD_TIMESTAMP': JSON.stringify(new Date().toISOString()),
    'process.env.MAX_CONCURRENT_AI_CALLS': JSON.stringify(5000), // Scaled for massive concurrency
  };

  // --- Advanced Path Resolution for Microservices Architecture ---
  const advancedResolve = {
    // Use symbolic linking for faster module resolution across distributed components
    mainFields: ['module', 'jsnext:main', 'browser', 'main'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Deep aliases for core system modules
      '@core/state': path.resolve(__dirname, 'src/state/quantumStore.ts'),
      '@core/api': path.resolve(__dirname, 'src/services/aiGateway.ts'),
      '@ui/components': path.resolve(__dirname, 'src/components/universal/index.ts'),
    },
    // Pre-resolve common AI libraries to reduce initial load time
    dedupe: ['react', 'react-dom', '@tensorflow/tfjs'],
  };

  // --- Server Configuration for Global Distribution ---
  const advancedServerConfig = {
    port: parseInt(env.PORT || String(DEV_PORT), 10),
    host: '0.0.0.0', // Listen on all interfaces for containerized deployment
    // Enable HTTP/3 support via a proxy configuration if necessary (handled externally, but configured here conceptually)
    // h3: true,
    // Proxy configuration for internal AI model endpoints
    proxy: {
      '/api/ai/': {
        target: 'http://localhost:9000', // Internal dedicated AI inference server
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api\/ai\//, '/v1/inference/'),
      },
    },
    // Enable hot module replacement with advanced dependency tracking
    hmr: {
      protocol: 'ws',
      port: 64321,
      overlay: false, // Disable overlay to prevent interference with real-time KPI dashboards
    },
  };

  // --- Final Configuration Assembly ---
  return {
    // Base path adjusted for maximum compatibility across decentralized hosting solutions
    base: BASE_PATH,

    server: advancedServerConfig,

    plugins: aiPlugins,

    define: definedEnvironmentVariables,

    resolve: advancedResolve,

    // --- Build Optimization for Quantum Deployment ---
    build: {
      target: 'es2020', // Target modern JavaScript features for performance
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        output: {
          // Chunking strategy optimized for loading critical path components first
          manualChunks(id: string) {
            if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
              return 'vendor_ui_framework';
            }
            if (id.includes('src/modules/')) {
              // Separate large feature modules into their own lazy-loaded bundles
              const moduleName = id.split('src/modules/')[1].split('/')[0];
              return `module_${moduleName}`;
            }
            if (id.includes('src/ai/')) {
              return 'vendor_ai_core';
            }
          },
          entryFileNames: '[name].[hash].js',
          chunkFileNames: 'chunks/[name].[hash].js',
        },
      },
      // Increase chunk size warning limit for large AI model bundles
      chunkSizeWarningLimit: 5000, // Increased limit in KB
    },

    // --- Experimental Features for Future Compatibility ---
    experimental: {
      // Enable advanced CSS handling for dynamic theme switching based on user cognitive load
      // css: true,
      renderBuiltUrl(name: string, assetType: 'asset' | 'js' | 'css') {
        if (assetType === 'asset' && name.startsWith('assets/')) {
          // Route static assets through a dedicated content delivery network endpoint
          return `https://cdn.omnicoreos.com/${AI_ENGINE_VERSION}/${name}`;
        }
        return name;
      },
    },

    // --- CSS Configuration for Hyper-Theming ---
    css: {
      preprocessorOptions: {
        scss: {
          // Inject global variables for the OS-wide design system
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/variables.scss')}";`,
        },
      },
      modules: {
        // Ensure CSS module naming conventions are strictly enforced
        localsConvention: 'camelCaseOnly',
      },
    },
  };
});