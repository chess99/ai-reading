import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // 静态导出
  basePath: '/ai-reading',
  images: {
    unoptimized: true, // 静态导出需要
  },
  trailingSlash: true, // 生成 /path/ 而不是 /path.html
};

export default nextConfig;
