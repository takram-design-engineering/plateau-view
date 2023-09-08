/// <reference types="vitest" />

import { join } from 'path'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/cesium-vector-imagery',

  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true
    }),
    nxViteTsPaths()
  ],

  // Uncomment this if you are using workers.
  worker: {
    plugins: [nxViteTsPaths()]
  },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'cesium-vector-imagery',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es']
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['@cesium/engine']
    }
  }
})
