import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import scss from 'rollup-plugin-scss';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'server', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default [
  {
    input: 'src/main.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'EpiVis',
      file: 'public/bundle.js',
      globals: {
        uikit: 'UIkit',
      },
    },
    external: ['uikit'],
    plugins: [
      replace({
        values: {
          'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
          __VERSION__: JSON.stringify(pkg.version),
          'process.env.EPIDATA_ENDPOINT_URL': JSON.stringify(
            process.env.EPIDATA_ENDPOINT_URL || 'https://api.delphi.cmu.edu/epidata',
          ),
        },
        preventAssignment: true,
      }),
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      scss({ output: 'public/bundle.css' }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload('public'),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/wrapper/wrapper.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'wrapper',
      file: 'public/wrapper.js',
    },
    plugins: [
      scss({ output: 'public/wrapper.css' }),
      resolve({
        browser: true,
      }),
      commonjs(),
      production && terser(),
    ],
  },
];
