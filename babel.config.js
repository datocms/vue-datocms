module.exports = {
  presets: [
    '@vue/babel-preset-jsx',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};