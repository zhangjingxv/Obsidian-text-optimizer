# 上传代码到 GitHub 的步骤

## 方法一：使用 GitHub 网页界面（推荐）

### 1. 创建新仓库
1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `deepseek-text-optimizer` (或你喜欢的名称)
   - **Description**: `基于 DeepSeek API 的 Obsidian 文本优化、思维启发和 AI 观点咨询插件`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
3. 点击 "Create repository"

### 2. 推送代码
在终端中执行以下命令（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）：

```bash
cd "/Users/zhangjingxu/Desktop/obsidian插件"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/deepseek-text-optimizer.git

# 或者使用 SSH（如果你配置了 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/deepseek-text-optimizer.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

## 方法二：使用 GitHub Desktop

1. 下载并安装 GitHub Desktop: https://desktop.github.com/
2. 打开 GitHub Desktop
3. 点击 "File" -> "Add Local Repository"
4. 选择插件目录：`/Users/zhangjingxu/Desktop/obsidian插件`
5. 点击 "Publish repository"
6. 填写仓库名称和描述，然后点击 "Publish Repository"

## 方法三：使用命令行（如果已配置 SSH）

如果你已经配置了 GitHub SSH key，可以直接使用以下命令创建仓库：

```bash
cd "/Users/zhangjingxu/Desktop/obsidian插件"

# 创建仓库（需要先安装 GitHub CLI: brew install gh）
# gh repo create deepseek-text-optimizer --public --source=. --remote=origin --push
```

## 验证

推送成功后，访问你的 GitHub 仓库页面，应该能看到所有文件都已上传。

