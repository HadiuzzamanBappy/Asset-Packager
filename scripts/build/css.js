const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssUrl = require('postcss-url');
const { glob } = require('glob');
const fs = require('fs-extra');
const paths = require('../../config/paths');
const constants = require('../../config/constants');
const { measurePerformance } = require('./utils');

async function bundleCSS() {
  const cssFiles = await glob(paths.src.css);
  const bundleContent = await concatenateFiles(cssFiles);
  await processCSS(bundleContent);
}

async function concatenateFiles(files) {
  return (await Promise.all(
    files.map(file => fs.readFile(file, 'utf8'))
  )).join('\n');
}

async function processCSS(css) {
  const cssPath = path.join(paths.dist.base, paths.dist.css);
  
  // Development processing
  const devResult = await postcss([
    postcssUrl({ url: 'rebase' }),
    autoprefixer({ overrideBrowserslist: constants.SUPPORTED_BROWSERS })
  ]).process(css, { from: cssPath, to: cssPath });
  
  await fs.writeFile(cssPath, devResult.css);
  
  // Production processing
  const prodResult = await postcss([
    postcssUrl({ url: 'rebase' }),
    autoprefixer({ overrideBrowserslist: constants.SUPPORTED_BROWSERS }),
    cssnano({ preset: constants.CSS_NANO_PRESET })
  ]).process(css, { from: cssPath, to: cssPath });
  
  const minPath = cssPath.replace('.css', '.min.css');
  await fs.writeFile(minPath, prodResult.css);
}

module.exports = bundleCSS;