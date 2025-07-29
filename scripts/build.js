#!/usr/bin/env node

const clean = require('./build/clean');
const bundleJS = require('./build/js');
const bundleCSS = require('./build/css');
const { parallelize, validateEnvironment } = require('./build/utils');
const logger = require('./build/logger');

async function build() {
  if (process.argv.includes('clean')) {
    await clean();
    logger.success('Clean completed!');
    process.exit(0);
  }

  try {
    validateEnvironment();
    logger.info(`Starting ${process.env.NODE_ENV} build...`);

    await clean();
    await parallelize([bundleJS, bundleCSS]);

    logger.success('Build completed successfully!');
  } catch (error) {
    logger.error('Build failed:');
    logger.error(error);
    process.exit(1);
  }
}

build();
