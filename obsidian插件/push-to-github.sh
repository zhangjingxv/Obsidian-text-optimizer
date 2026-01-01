#!/bin/bash

# DeepSeek 文本优化器 - 推送到 GitHub 脚本
# 使用方法: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "❌ 错误: 请提供你的 GitHub 用户名"
    echo "使用方法: ./push-to-github.sh YOUR_GITHUB_USERNAME"
    echo "例如: ./push-to-github.sh zhangjingxu"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="deepseek-text-optimizer"

echo "🚀 开始推送到 GitHub..."
echo "📦 仓库名称: $REPO_NAME"
echo "👤 GitHub 用户名: $GITHUB_USERNAME"
echo ""

# 检查是否已经添加了远程仓库
if git remote | grep -q "origin"; then
    echo "⚠️  检测到已存在的远程仓库，正在更新..."
    git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
else
    echo "➕ 添加远程仓库..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

# 确保分支名为 main
git branch -M main

echo ""
echo "📝 请先在 GitHub 上创建仓库:"
echo "   1. 访问: https://github.com/new"
echo "   2. 仓库名称填写: $REPO_NAME"
echo "   3. 描述: 基于 DeepSeek API 的 Obsidian 文本优化、思维启发和 AI 观点咨询插件"
echo "   4. 选择 Public 或 Private"
echo "   5. ⚠️  不要勾选 'Initialize this repository with a README'"
echo "   6. 点击 'Create repository'"
echo ""
read -p "✅ 创建完成后，按 Enter 继续推送代码..."

echo ""
echo "📤 正在推送代码到 GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ 成功！代码已推送到 GitHub"
    echo "🔗 仓库地址: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "   1. 是否已在 GitHub 上创建了仓库"
    echo "   2. 是否有网络连接"
    echo "   3. 是否有推送权限"
    echo ""
    echo "💡 如果使用 SSH，可以手动执行："
    echo "   git remote set-url origin git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"
    echo "   git push -u origin main"
fi

