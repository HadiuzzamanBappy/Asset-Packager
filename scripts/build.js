#!/usr/bin/env node

const clean = require('./build/clean');
const bundleJS = require('./build/js');
const bundleCSS = require('./build/css');
const { parallelize, validateEnvironment } = require('./build/utils');
const logger = require('./build/logger'); // Add this

async function build() {
  try {
    validateEnvironment();
    
    logger.info(`Starting ${process.env.NODE_ENV} build...`);
    
    // Clean and create dist directory
    await clean();
    
    // Parallel processing of assets
    await parallelize([
      bundleJS,
      bundleCSS
    ]);
    
    logger.success('Build completed successfully!');
  } catch (error) {
    logger.error('Build failed:');
    logger.error(error);
    process.exit(1);
  }
}

build();