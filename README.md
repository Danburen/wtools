# 实用前端工具（Web Tools）

基于 **Vue 3 + TypeScript + Vite + Element Plus** 构建的纯前端实用工具集。

## 🌟 已包含工具

1. **ZIP 在线压缩/解压**
   - 使用纯前端技术完成 ZIP 文件的压缩与解压处理。
   - 支持多文件拉入打包下载与进度条显示等。

2. **Java DTO 转 TypeScript**
   - 快速解析常见的 Java DTO/VO（支持解析 `public class` 及 `private Type field`）。
   - 自动映射通用基础类关系（如 `String` -> `string`, `Integer`/`Long` -> `number`, `List<T>` -> `Array<T>` 等）。
   - 若遇到未知的自定义对象/非常规结构，会生成警告并标记 `FIXME` 需提供定义。

## 🚀 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 运行本地开发服务器
npm run dev

# 3. 生产环境构建
npm run build
```

## ☁️ 自动部署

项目已经配置好基于 GitHub Actions 的 CI/CD 流程 (`.github/workflows/deploy.yml`) 以及由 Vite 提供的支持相对路径生成的配置 (`vite.config.ts` 中的 `base: './'`)。

当你 `push` 到 Github 中的 `main` / `master` 分支时：
1. Action 会自动克隆代码、安装依赖、构建前端。
2. 生成的文件会被自动推送到 **GitHub Pages**。

> **设置注意**: 须前往你的代码仓库 **Settings -> Pages**，把 **Build and deployment -> Source** 选项切换到 **GitHub Actions** 才能激活自动构建产物的对外托管访问。
