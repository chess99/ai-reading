# PWA 图标说明

## 需要的图标文件

- `icon-192.png` - 192x192 像素
- `icon-512.png` - 512x512 像素

## 生成方法

### 方法 1: 使用浏览器（推荐）

1. 在浏览器中打开项目根目录的 `generate-icons.html`
2. 点击按钮自动生成并下载图标
3. 将下载的文件放到此目录

### 方法 2: 使用在线工具

访问 [RealFaviconGenerator](https://realfavicongenerator.net/)
- 上传 `icon.svg`
- 选择需要的图标尺寸
- 下载并解压到此目录

### 方法 3: 使用命令行工具

如果安装了 ImageMagick:
```bash
convert -background none -resize 192x192 icon.svg icon-192.png
convert -background none -resize 512x512 icon.svg icon-512.png
```

如果使用 sharp-cli:
```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon-192.png resize 192 192
sharp -i icon.svg -o icon-512.png resize 512 512
```

## 临时方案

在生成真实图标之前，PWA 会使用 `icon.svg` 作为后备图标。
但为了最佳兼容性，建议生成 PNG 格式的图标。
