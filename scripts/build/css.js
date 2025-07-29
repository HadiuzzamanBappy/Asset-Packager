const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const glob = require('glob');
const paths = require('../../config/paths');
const constants = require('../../config/constants');
const { measurePerformance } = require('./utils');

async function bundleCSS() {
  await measurePerformance('Bundle CSS', async () => {
    const files = glob.sync(paths.src.css);
    const combined = (await Promise.all(files.map(file => fs.readFile(file, 'utf8')))).join('\n');

    const processed = await postcss([autoprefixer]).process(combined, { from: undefined });
    const outputPath = path.join(paths.dist.base, paths.dist.css);

    await fs.writeFile(outputPath, processed.css);

    const minified = await postcss([cssnano({ preset: constants.CSS_NANO_PRESET })]).process(combined, { from: undefined });
    const minPath = outputPath.replace('.css', '.min.css');

    await fs.writeFile(minPath, minified.css);
  });
}

module.exports = bundleCSS;
