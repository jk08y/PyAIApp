// Path: babel.config.js
module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'react-native-reanimated/plugin',
        [
          'module-resolver',
          {
            root: ['./'],
            extensions: [
              '.ios.js',
              '.android.js',
              '.js',
              '.json',
            ],
            alias: {
              '@components': './src/components',
              '@screens': './src/screens',
              '@navigation': './src/navigation',
              '@services': './src/services',
              '@context': './src/context',
              '@hooks': './src/hooks',
              '@utils': './src/utils',
              '@constants': './src/constants',
              '@assets': './assets',
              '@data': './src/data',
            },
          },
        ],
      ],
    };
  };