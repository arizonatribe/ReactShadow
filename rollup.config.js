const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const {minify} = require('uglify-es');

const env = process.env.NODE_ENV || 'development'
const format = process.env.BABEL_ENV || 'iife'
const config = {
  input: 'src/react-shadow.js',
  plugins: [],
  external: [
    'react',
    'react-dom'
  ],
  output: {
    format,
    name: 'react-shadow',
    indent: false,
    exports: 'named'
  }
}

if (/development|production/.test(env)) {
  config.plugins.push(
    commonjs({include: ['node_modules/**']}),
    nodeResolve({browser: true, preferBuiltins: true, jsnext: true}),
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: [['env', {modules: format === 'commonjs'}], 'react', 'stage-0'],
      plugins: ['ramda']
    }),
    replace({'process.env.NODE_ENV': JSON.stringify(env)})
  )
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    }, minify)
  )
}

export default config
