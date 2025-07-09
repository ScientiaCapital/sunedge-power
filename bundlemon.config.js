export default {
  files: [
    {
      path: 'dist/assets/*.js',
      maxSize: '500kb',
      maxPercentIncrease: 10,
    },
    {
      path: 'dist/assets/*.css',
      maxSize: '100kb',
      maxPercentIncrease: 10,
    },
  ],
  outDir: 'dist',
  defaultCompression: 'gzip',
};
