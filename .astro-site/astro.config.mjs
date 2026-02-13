import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cearl.cc',
  base: '/ai-reading',
  outDir: './dist',
  build: {
    format: 'directory'
  }
});
