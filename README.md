# DeepSeek 文本优化器

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Obsidian](https://img.shields.io/badge/Obsidian-0.15.0+-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**一个基于 DeepSeek API 的 Obsidian 插件，为你的笔记提供智能文本优化、思维启发和 AI 观点咨询**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [使用指南](#-使用指南) • [开发](#-开发) • [常见问题](#-常见问题)

</div>

---

## 📖 项目简介

DeepSeek 文本优化器是一个强大的 Obsidian 插件，旨在帮助你提升笔记质量。通过集成 DeepSeek API，插件可以：

- ✨ **优化文本表达** - 让零散的思考变得流畅清晰
- 💡 **提供思维启发** - 拓展你的思考维度和深度
- 🤖 **AI 观点咨询** - 获得多角度的分析和建议

无论你是记录日常思考、整理学习笔记，还是撰写文章草稿，这个插件都能帮助你提升内容质量。

## ✨ 功能特性

### 核心功能

#### 1. 📝 文本优化
- 自动优化文本表达，提升流畅度和可读性
- 保持原意不变，只改进表达方式
- 支持选中文本或整篇笔记处理

#### 2. 💡 思维启发
- 基于文本内容提供相关的思考启发
- 提供延伸建议和拓展方向
- 帮助发现新的思考角度

#### 3. 🤖 AI 观点咨询
- 从多个角度提供观点和分析
- 评价想法的优缺点
- 提供改进建议和潜在问题分析

### 使用方式

- **选中文本处理**：选中要处理的文本，然后执行相应命令
- **整篇笔记处理**：不选中任何文本，将处理整个文档
- **自动替换选项**：可在设置中开启自动替换原文，或选择生成新版本
- **组合功能**：支持同时执行多个功能，提高效率

## 🚀 快速开始

### 前置要求

- Obsidian v0.15.0 或更高版本
- 有效的 [DeepSeek API Key](https://platform.deepseek.com/)

### 安装方式

#### 方式一：从源码安装（推荐用于开发）

1. 克隆或下载本仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建插件：
   ```bash
   npm run build
   ```
4. 将整个文件夹复制到 Obsidian 插件目录：
   ```
   .obsidian/plugins/deepseek-text-optimizer/
   ```
5. 在 Obsidian 中启用插件

#### 方式二：手动安装

1. 下载最新版本的 `main.js`、`manifest.json` 和 `styles.css`（如果有）
2. 在 Obsidian 插件目录创建文件夹：`deepseek-text-optimizer`
3. 将文件放入该文件夹
4. 在 Obsidian 中启用插件

### 配置

1. 打开 Obsidian 设置（⚙️）
2. 进入「DeepSeek 文本优化器设置」
3. 输入你的 DeepSeek API Key
4. （可选）选择模型：
   - `deepseek-chat` - 通用对话模型（推荐）
   - `deepseek-coder` - 代码专用模型
5. （可选）配置自动替换选项

## 📚 使用指南

### 可用命令

插件提供以下命令，可通过命令面板（`Ctrl/Cmd + P`）访问：

| 命令 | 功能描述 |
|------|---------|
| **优化文本** | 仅优化文本表达 |
| **思维启发** | 仅生成思维启发和延伸建议 |
| **AI 观点咨询** | 仅提供 AI 观点和分析 |
| **优化文本 + 思维启发** | 同时执行文本优化和思维启发 |
| **优化文本 + AI 观点咨询** | 同时执行文本优化和观点咨询 |
| **全部功能** | 同时执行所有三个功能 |

### 使用示例

#### 示例 1：优化文本

1. 选中一段需要优化的文本
2. 打开命令面板（`Ctrl/Cmd + P`）
3. 输入「优化文本」并执行
4. 根据设置，文本会被替换或添加到文档末尾

**原始文本：**
```
今天想了很多关于工作的事情。觉得现在的工作有点无聊。想要换一个更有挑战性的工作。但是又担心风险。
```

**优化后：**
```
今天深入思考了职业发展的问题。当前工作缺乏挑战性，让我感到有些乏味。我渴望寻找更具挑战性的机会，但同时也对潜在的风险感到担忧。
```

#### 示例 2：获取思维启发

1. 选中一段文本
2. 执行「思维启发」命令
3. 在文档末尾查看 AI 提供的思考启发

#### 示例 3：组合功能

1. 选中文本
2. 执行「全部功能」命令
3. 一次性获得优化文本、思维启发和 AI 观点

### 使用场景

- 📝 **日常思考记录** - 优化零散的思考片段，使其更加清晰
- 📚 **学习笔记整理** - 提升笔记的可读性和逻辑性
- ✍️ **文章草稿优化** - 改进文章表达，提升写作质量
- 💭 **思维拓展** - 获得新的思考角度和延伸方向
- 🔍 **内容审查** - 获取 AI 对内容的评价和建议

## 🛠️ 开发

### 开发环境设置

```bash
# 克隆仓库
git clone <repository-url>
cd deepseek-text-optimizer

# 安装依赖
npm install

# 开发模式（自动监听文件变化并重新构建）
npm run dev

# 构建生产版本
npm run build
```

### 项目结构

```
deepseek-text-optimizer/
├── main.ts                 # 主入口文件
├── manifest.json           # 插件清单
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript 配置
├── esbuild.config.mjs      # 构建配置
├── src/
│   ├── deepseek-api.ts     # DeepSeek API 服务
│   └── settings.ts          # 设置界面
└── README.md               # 项目文档
```

### 技术栈

- **TypeScript** - 类型安全的开发
- **Obsidian API** - Obsidian 插件开发框架
- **DeepSeek API** - AI 文本处理服务

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| API Key | string | - | DeepSeek API 密钥（必需） |
| 模型 | dropdown | `deepseek-chat` | 选择使用的 AI 模型 |
| 自动替换原文 | boolean | `false` | 优化后是否自动替换选中文本 |

## ❓ 常见问题

### Q: 如何获取 DeepSeek API Key？

A: 访问 [DeepSeek 平台](https://platform.deepseek.com/)，注册账号并创建 API Key。

### Q: 使用插件会产生费用吗？

A: 是的，调用 DeepSeek API 会产生费用。具体费用请参考 [DeepSeek 定价页面](https://platform.deepseek.com/pricing)。建议先在小段文本上测试功能。

### Q: 支持哪些语言？

A: 插件支持中文和英文文本处理。DeepSeek API 支持多种语言，但中文和英文效果最佳。

### Q: 优化后的文本会完全替换原文吗？

A: 这取决于你的设置。如果开启「自动替换原文」，选中的文本会被替换；否则会在文档末尾添加优化后的文本。

### Q: 可以处理多长的文本？

A: 理论上没有严格限制，但建议单次处理不超过 2000 tokens（约 1500-2000 字）。过长的文本可能会影响处理效果和速度。

### Q: 插件支持离线使用吗？

A: 不支持。插件需要联网调用 DeepSeek API 才能工作。

### Q: 如何报告问题或提出建议？

A: 请在 GitHub Issues 中提交问题或建议。我们欢迎所有反馈！

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循现有的代码风格
- 添加适当的注释
- 确保代码通过 TypeScript 编译
- 更新相关文档

## 📝 更新日志

### v1.0.0 (2026-01-01)

- ✨ 初始版本发布
- ✨ 文本优化功能
- ✨ 思维启发功能
- ✨ AI 观点咨询功能
- ✨ 组合功能支持
- ✨ 设置界面

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [Obsidian](https://obsidian.md/) - 优秀的笔记应用
- [DeepSeek](https://www.deepseek.com/) - 强大的 AI 服务
- 所有贡献者和用户

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 微信：Heart--0314

---

<div align="center">

**如果这个插件对你有帮助，请给个 ⭐ Star！**

Made with ❤️ for Obsidian users

</div>
