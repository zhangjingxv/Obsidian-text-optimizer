# 📦 安装指南

## 快速安装步骤

### 1. 找到你的 Obsidian 插件目录

Obsidian 插件目录通常位于：
- **Windows**: `%APPDATA%\Obsidian\plugins\`
- **macOS**: `~/Library/Application Support/obsidian/plugins/`
- **Linux**: `~/.config/obsidian/plugins/`

或者在你的 Obsidian 库中：
```
你的库路径/.obsidian/plugins/
```

### 2. 复制插件文件

将以下文件复制到插件目录下的 `deepseek-text-optimizer` 文件夹：

```
.obsidian/plugins/deepseek-text-optimizer/
├── main.js          ✅ 必需
├── manifest.json    ✅ 必需
└── styles.css       ✅ 必需（可选，但推荐）
```

### 3. 在 Obsidian 中启用插件

1. 打开 Obsidian
2. 进入 **设置** (⚙️) → **第三方插件**
3. 找到 **DeepSeek Text Optimizer**
4. 点击 **启用** 开关

### 4. 配置 API Key

1. 在设置中找到 **DeepSeek 文本优化器设置**
2. 输入你的 DeepSeek API Key（从 https://platform.deepseek.com/ 获取）
3. （可选）选择模型和配置其他选项

## 🚀 使用方式

### 方式一：工具栏按钮（推荐）

1. 点击左侧工具栏的 ✨ 图标
2. 从菜单中选择功能

### 方式二：命令面板

1. 按 `Ctrl/Cmd + P` 打开命令面板
2. 输入功能名称（如"优化文本"）
3. 选择并执行

### 方式三：状态栏

- 点击状态栏的插件状态可以快速打开设置（如果未配置）

## 📋 必需文件清单

确保以下文件都在插件目录中：

- [x] `main.js` - 主程序文件（已编译）
- [x] `manifest.json` - 插件清单
- [x] `styles.css` - 样式文件（可选但推荐）

## ⚠️ 常见问题

### 插件无法加载

1. 检查文件是否都在正确的位置
2. 确保 `main.js` 文件不是空的
3. 查看 Obsidian 开发者控制台（`Ctrl/Cmd + Shift + I`）是否有错误

### API 调用失败

1. 检查 API Key 是否正确
2. 确认网络连接正常
3. 查看控制台错误信息

### 工具栏按钮不显示

1. 确保插件已启用
2. 尝试重新加载 Obsidian（`Ctrl/Cmd + R`）

## 🔧 开发模式安装

如果你想在开发时使用符号链接：

```bash
# 1. 在开发目录运行开发模式
cd /Users/zhangjingxu/Desktop/Obsidian-text-optimizer
npm run dev

# 2. 在另一个终端创建符号链接
ln -s /Users/zhangjingxu/Desktop/Obsidian-text-optimizer ~/你的库路径/.obsidian/plugins/deepseek-text-optimizer
```

这样修改代码后会自动重新编译，刷新 Obsidian 即可看到效果。

