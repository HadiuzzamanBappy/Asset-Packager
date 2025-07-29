const path = require('path');
const { glob } = require('glob');
const { minify } = require('terser');
const fs = require('fs-extra');
const paths = require('../../config/paths');
const constants = require('../../config/constants');
const { measurePerformance } = require('./utils');

async function bundleJS() {
  let jsFiles = await glob(paths.src.js);
  jsFiles = sortByDependencies(jsFiles);

  const bundleContent = await concatenateFiles(jsFiles);
  await outputBundles(bundleContent);
}

function sortByDependencies(files) {
  return files.sort((a, b) => {
    if (a.includes('jquery')) return -1;
    if (b.includes('jquery')) return 1;
    return a.localeCompare(b);
  });
}

async function concatenateFiles(files) {
  return (await Promise.all(
    files.map(file => fs.readFile(file, 'utf8'))
  )).join('\n');
}

async function outputBundles(content) {
  const jsPath = path.join(paths.dist.base, paths.dist.js);

  await fs.writeFile(jsPath, content);

  const minified = await minify(content, {
    ecma: constants.JS_ECMA_VERSION,
    compress: true,
    mangle: true,
    sourceMap: false
  });

  const minPath = jsPath.replace('.js', '.min.js');
  await fs.writeFile(minPath, minified.code);
}

module.exports = bundleJS;
