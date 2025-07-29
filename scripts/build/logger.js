const chalk = require('chalk');

module.exports = {
  debug: (...args) => console.log(chalk.gray('[DEBUG]'), ...args),
  info: (...args) => console.log(chalk.cyan('[INFO]'), ...args),
  success: (...args) => console.log(chalk.green('[SUCCESS]'), ...args),
  warn: (...args) => console.warn(chalk.yellow('[WARN]'), ...args),
  error: (...args) => console.error(chalk.red('[ERROR]'), ...args)
};