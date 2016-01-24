import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';

rollup({
  entry: 'index.js',
  plugins: [ babel({
    presets: [ 'es2015-rollup' ]
  }) ]
}).then(bundle => Promise.all([
  bundle.write({
    dest: 'dist/json-adapter.js',
    format: 'cjs',
    sourceMap: 'inline'
  }),
  bundle.write({
    dest: 'dist/json-adapter.es2015.js',
    format: 'es6',
    sourceMap: 'inline'
  })
])).catch(error => console.log(error));
