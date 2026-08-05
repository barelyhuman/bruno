import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginStyledComponents } from '@rsbuild/plugin-styled-components';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginRemoteImages } from './plugins/remote-images/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * Force a single physical copy of CM6 core packages.
 * Duplicate @codemirror/language (e.g. root 6.0.0 vs app 6.12.4) breaks
 * syntax highlighting because LanguageSupport and syntaxHighlighting register
 * on different Facet instances.
 */
function resolveCm6(pkg) {
  // require.resolve returns .../dist/index.cjs — alias to the package root
  return path.resolve(path.dirname(require.resolve(pkg)), '..');
}

const remoteImageDomains = (process.env.BRUNO_REMOTE_IMAGE_DOMAINS || 'd3icksk7srk4uh.cloudfront.net')
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [
    pluginNodePolyfill(),
    pluginReact(),
    pluginStyledComponents(),
    pluginSass(),
    pluginBabel({
      include: /\.(?:js|jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
      }
    }),
    pluginRemoteImages({
      domains: remoteImageDomains,
      include: [/\.md$/]
    })
  ],
  source: {
    tsconfigPath: './jsconfig.json', // Specifies the path to the JavaScript/TypeScript configuration file,
    exclude: [
      '**/test-utils/**',
      '**/*.test.*',
      '**/*.spec.*'
    ],
    alias: {
      '@codemirror/language': resolveCm6('@codemirror/language'),
      '@codemirror/state': resolveCm6('@codemirror/state'),
      '@codemirror/view': resolveCm6('@codemirror/view'),
      '@codemirror/autocomplete': resolveCm6('@codemirror/autocomplete'),
      '@lezer/common': resolveCm6('@lezer/common'),
      '@lezer/highlight': resolveCm6('@lezer/highlight')
    }
  },
  html: {
    title: 'Bruno'
  },
  tools: {
    rspack: {
      module: {
        parser: {
          javascript: {
            // This loads the JavaScript contents from a library along with the main JavaScript bundle.
            dynamicImportMode: "eager",
          },
        }
      },
      ignoreWarnings: [
        (warning) =>  warning.message.includes('Critical dependency: the request of a dependency is an expression') && warning?.moduleDescriptor?.name?.includes('flow-parser')
      ],
      // Add externals configuration to exclude Node.js libraries
      externals: {
        // List specific Node.js modules you want to exclude
        // Format: 'module-name': 'commonjs module-name'
        'worker_threads': 'commonjs worker_threads',
        // 'path': 'commonjs path'
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            // CodeMirror's modes/addons/themes + codemirror-graphql are all
            // required upfront (pages/Bruno/index.js) but rarely change —
            // pulling them into their own initial chunk lets the browser
            // fetch it in parallel with the main bundle instead of inflating
            // one monolithic file.
            codemirror6: {
              test: /[\\/]node_modules[\\/]@codemirror[\\/]/,
              name: 'lib-codemirror6',
              chunks: 'all',
              priority: 10
            },
            // CM6 packages (@codemirror/*, @lezer/*) — keep separate from CM5
            codemirror6: {
              test: /[\\/]node_modules[\\/](@codemirror|@lezer)[\\/]/,
              name: 'lib-codemirror6',
              chunks: 'all',
              priority: 11
            }
          }
        }
      }
    },
  }
});
