const path = require('path');

module.exports = {
  src: {
    base: path.join(__dirname, '../src'),
    js: path.join(__dirname, '../src/js/**/*.js'),
    css: path.join(__dirname, '../src/css/**/*.css')
  },
  dist: {
    base: path.join(__dirname, '../dist'),
    js: 'vendor.js',
    css: 'vendor.css'
  }
};
