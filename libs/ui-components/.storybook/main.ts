import path from 'path'
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ['../src/**/*.story.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: ''
      }
    }
  },
  viteFinal: async config =>
    mergeConfig(config, {
      plugins: [tsconfigPaths()],
      // WORKAROUND: https://github.com/nrwl/nx/issues/17156
      resolve: {
        alias: {
          '@takram/plateau-color-schemes': path.resolve(
            __dirname,
            '../../color-schemes/src/index.ts'
          )
        }
      }
    }),
  features: {
    storyStoreV7: false
  }
}

export default config

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
