import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://chess99.github.io',
  base: '/ai-reading',
  outDir: '../dist',
  build: {
    format: 'directory'
  }
});
