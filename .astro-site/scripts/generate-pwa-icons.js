/**
 * 生成 PWA 图标
 * 使用方法：在浏览器中打开 generate-icons.html
 * 或使用在线工具生成图标
 */

console.log(`
PWA 图标生成说明
================

方法1: 使用浏览器生成
1. 在浏览器中打开: file:///.../generate-icons.html
2. 点击按钮生成并下载图标
3. 将下载的文件放到 public/ 目录

方法2: 使用在线工具
访问: https://realfavicongenerator.net/
上传 public/icon.svg 并生成所有图标

方法3: 使用 ImageMagick
npm install -g sharp-cli
sharp -i public/icon.svg -o public/icon-192.png resize 192 192
sharp -i public/icon.svg -o public/icon-512.png resize 512 512

当前需要生成的文件：
- public/icon-192.png (192x192)
- public/icon-512.png (512x512)
`);
