const fs = require('fs-extra');
const paths = require('../../config/paths');
const { measurePerformance } = require('./utils');

module.exports = async function clean() {
  await measurePerformance('Clean Dist', async () => {
    await fs.emptyDir(paths.dist.base);
    await fs.ensureDir(paths.dist.base);
  });
};