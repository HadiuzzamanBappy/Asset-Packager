const path = require('path');

module.exports = {
  // Source paths
  src: {
    base: path.join(__dirname, '../src'),
    js: path.join(__dirname, '../src/js/**/*.js'),
    css: path.join(__dirname, '../src/css/**/*.css')
  },
  
  // Output paths
  dist: {
    base: path.join(__dirname, '../dist'),
    js: 'vendor.js',
    css: 'vendor.css'
  },
  
  // Cache paths
  cache: {
    base: path.join(__dirname, '../node_modules/.cache/build')
  }
};