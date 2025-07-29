function validateEnvironment() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
}

async function parallelize(tasks) {
  await Promise.all(tasks.map(task => task()));
}

function measurePerformance(label, fn) {
  const start = performance.now();
  return Promise.resolve(fn()).then(() => {
    const duration = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`[PERF] ${label}: ${duration}s`);
  });
}

module.exports = {
  validateEnvironment,
  parallelize,
  measurePerformance
};
