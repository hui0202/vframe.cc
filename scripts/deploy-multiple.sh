#!/bin/bash

# Vercel 多项目部署脚本
# 将同一份代码部署到多个不同的 Vercel 项目

echo "🚀 开始部署同一份代码到多个 Vercel 项目..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目列表 - 在这里添加您要部署的所有项目名称
PROJECTS=(
  "vframe-cc"
  "vframe-cc-7qaj"
)

# 部署函数
deploy_project() {
  local project_name=$1
  
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}📦 正在部署到项目: ${project_name}${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  # 部署到 Vercel (使用 --prod 部署到生产环境)
  vercel --prod --name ${project_name} --yes
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ${project_name} 部署成功！${NC}"
  else
    echo -e "${RED}❌ ${project_name} 部署失败！${NC}"
    echo -e "${RED}请检查项目配置和权限${NC}"
    return 1
  fi
  
  echo ""
}

# 主执行函数
main() {
  # 检查是否安装了 Vercel CLI
  if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ 错误: Vercel CLI 未安装${NC}"
    echo "请运行以下命令安装:"
    echo "  npm i -g vercel"
    exit 1
  fi
  
  # 统计信息
  local total=${#PROJECTS[@]}
  local success=0
  local failed=0
  
  echo -e "${BLUE}准备部署到 ${total} 个项目${NC}"
  echo ""
  
  # 部署到所有项目
  for project in "${PROJECTS[@]}"; do
    if deploy_project "$project"; then
      ((success++))
    else
      ((failed++))
    fi
  done
  
  # 显示部署结果
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}🎉 部署完成！${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  echo ""
  echo "📊 部署统计:"
  echo "  • 总项目数: ${total}"
  echo -e "  • ${GREEN}成功: ${success}${NC}"
  if [ $failed -gt 0 ]; then
    echo -e "  • ${RED}失败: ${failed}${NC}"
  fi
  
  echo ""
  echo "📝 项目列表:"
  for project in "${PROJECTS[@]}"; do
    echo "  • ${project}"
  done
  
  # 返回状态码
  if [ $failed -gt 0 ]; then
    exit 1
  fi
}

# 运行主函数
main
