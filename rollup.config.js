const pkg = require('./package.json');
const year = (new Date()).getFullYear();

export default {
  input: 'src/web-component-refs.js',
  output: {
    file: 'dist/web-component-refs.js',
    format: 'umd'
  },
  globals: [
    'window'
  ],
  name: 'webComponentRefs',
  indent: true,
  strict: true,
  banner: `/* ${ pkg.name } v${ pkg.version } - ${ year } - Jeremias Menichelli - MIT License */`
};
