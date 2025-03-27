// Path: metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo config
const defaultConfig = getDefaultConfig(__dirname);

// Add additional file extensions to assetExts
defaultConfig.resolver.assetExts.push('lottie', 'db');

// Add additional file extensions to sourceExts
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'mjs'];

// Configure module resolution for better performance
defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  '@': __dirname,
};

// Optimize Metro for large projects
defaultConfig.maxWorkers = 2;
defaultConfig.transformer.minifierPath = 'metro-minify-terser';
defaultConfig.transformer.minifierConfig = {
  ecma: 8,
  keep_classnames: false,
  keep_fnames: true,
  module: true,
  mangle: {
    keep_classnames: false,
    keep_fnames: true,
  },
};

module.exports = defaultConfig;