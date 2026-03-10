#!/bin/sh
# pre-commit hook: 检查并自动生成书籍 slug，检测冲突

# 检查是否有 books/ 下的 .md 文件变动（-c core.quotepath=false 避免中文路径被转义）
CHANGED=$(git -c core.quotepath=false diff --cached --name-only | grep '^books/.*\.md$')
if [ -z "$CHANGED" ]; then
  exit 0
fi

REPO_ROOT=$(git rev-parse --show-toplevel)

# 从 .nextjs-site/ 运行脚本（依赖在那里）
cd "$REPO_ROOT/.nextjs-site" && node scripts/slugify.js
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "💡 请解决以上问题后重新 git add 并 commit"
  exit 1
fi

# 如果有文件被修改（自动补了 slug），提示用户重新 add
cd "$REPO_ROOT"
MODIFIED=$(git -c core.quotepath=false diff --name-only | grep '^books/.*\.md$')
if [ -n "$MODIFIED" ]; then
  echo ""
  echo "📝 以下文件已自动添加 slug，请 git add 后重新 commit："
  echo "$MODIFIED" | sed 's/^/   /'
  exit 1
fi

exit 0
