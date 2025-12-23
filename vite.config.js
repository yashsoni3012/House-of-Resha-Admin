export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.houseofresha.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
