const logger = require('./logger');

module.exports = {
  async measurePerformance(name, fn) {
    const start = Date.now();
    await fn();
    const duration = Date.now() - start;
    logger.debug(`⏱️ ${name} completed in ${duration}ms`);
  },

  async parallelize(tasks) {
    return Promise.all(tasks.map(task => task()));
  },

  validateEnvironment() {
    if (process.env.NODE_ENV === undefined) {
      process.env.NODE_ENV = 'development';
    }
  }
};