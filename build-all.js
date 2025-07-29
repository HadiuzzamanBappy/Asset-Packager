const fs = require('fs-extra');
const { glob } = require('glob');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssUrl = require('postcss-url');
const { minify } = require('terser');

// Configuration
const config = {
  isProduction: process.env.NODE_ENV === 'production',
  src: {
    js: './src/js/**/*.js',
    css: './src/css/**/*.css'
  },
  dist: './dist',
  outputs: {
    js: 'vendor.js',
    css: 'vendor.css'
  }
};

// File Processing Utilities
const processFiles = async (pattern, processor) => {
  const files = await glob(pattern);
  return Promise.all(files.map(processor));
};

const readFileContent = async (file) => {
  return fs.readFile(file, 'utf8');
};

// Main Build Function
(async function build() {
  try {
    console.log('Starting build process...');
    console.log(`Environment: ${config.isProduction ? 'Production' : 'Development'}`);
    
    await fs.ensureDir(config.dist);

    // ========== JavaScript Processing ==========
    console.log('\nProcessing JavaScript files...');
    const jsFiles = await glob(config.src.js);
    
    // Sort with jQuery first, then alphabetical
    jsFiles.sort((a, b) => {
      const aIsJQuery = a.includes('jquery');
      const bIsJQuery = b.includes('jquery');
      if (aIsJQuery && !bIsJQuery) return -1;
      if (!aIsJQuery && bIsJQuery) return 1;
      return a.localeCompare(b);
    });

    // Bundle JS files
    const jsBundle = (await Promise.all(
      jsFiles.map(file => readFileContent(file))
    )).join('\n');

    await fs.writeFile(`${config.dist}/${config.outputs.js}`, jsBundle);
    console.log(`✓ Combined ${jsFiles.length} JS files into ${config.outputs.js}`);

    // Always create minified JS (not just in production)
    const minifyResult = await minify(jsBundle, {
      sourceMap: false,
      ecma: 2020,
      compress: true,
      mangle: true
    });

    const minifiedJsName = config.outputs.js.replace('.js', '.min.js');
    await fs.writeFile(`${config.dist}/${minifiedJsName}`, minifyResult.code);
    console.log(`✓ Created minified ${minifiedJsName}`);

    // ========== CSS Processing ==========
    console.log('\nProcessing CSS files...');
    const cssFiles = await glob(config.src.css);
    
    // Bundle CSS files
    const cssBundle = (await Promise.all(
      cssFiles.map(file => readFileContent(file))
    )).join('\n');

    // Process regular CSS (without minification)
    const regularCssPlugins = [
      postcssUrl({ url: 'rebase' }),
      autoprefixer()
    ];
    
    const regularCssResult = await postcss(regularCssPlugins)
      .process(cssBundle, {
        from: `${config.dist}/${config.outputs.css}`,
        to: `${config.dist}/${config.outputs.css}`,
        map: false
      });
    
    await fs.writeFile(`${config.dist}/${config.outputs.css}`, regularCssResult.css);
    console.log(`✓ Combined ${cssFiles.length} CSS files into ${config.outputs.css}`);

    // Process minified CSS (always create, not just in production)
    const minifiedCssPlugins = [
      postcssUrl({ url: 'rebase' }),
      autoprefixer(),
      cssnano() // Always include cssnano for minified version
    ];
    
    const minifiedCssName = config.outputs.css.replace('.css', '.min.css');
    const minifiedCssResult = await postcss(minifiedCssPlugins)
      .process(cssBundle, {
        from: `${config.dist}/${minifiedCssName}`,
        to: `${config.dist}/${minifiedCssName}`,
        map: false
      });
    
    await fs.writeFile(`${config.dist}/${minifiedCssName}`, minifiedCssResult.css);
    console.log(`✓ Created minified ${minifiedCssName}`);

    console.log('\nBuild completed successfully!');
    console.log(`Output directory: ${config.dist}`);

  } catch (err) {
    console.error('\nBuild failed:');
    console.error(err);
    process.exit(1);
  }
})();