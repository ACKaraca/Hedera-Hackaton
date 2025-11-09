export const logger = {
  info: (message, data = {}) => {
    console.log(`ℹ️  [INFO] ${message}`, Object.keys(data).length > 0 ? data : '');
  },
  error: (message, error) => {
    console.error(`❌ [ERROR] ${message}`, error?.message || error);
  },
  success: (message, data = {}) => {
    console.log(`✅ [SUCCESS] ${message}`, Object.keys(data).length > 0 ? data : '');
  },
  warn: (message, data = {}) => {
    console.warn(`⚠️  [WARN] ${message}`, Object.keys(data).length > 0 ? data : '');
  }
};
