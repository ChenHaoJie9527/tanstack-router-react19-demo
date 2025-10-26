# 贡献指南

感谢您对本项目的关注！这是一个教学示例项目，展示如何将 Zustand 集成到 TanStack Router 上下文中。

## 🤝 如何贡献

### 报告问题

如果您发现了 bug 或有改进建议：

1. 检查是否已有相关 Issue
2. 创建新 Issue，清晰描述问题
3. 如果可能，提供复现步骤

### 提交代码

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 代码规范

### 代码风格

本项目使用 Biome 进行代码格式化和检查：

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

### TypeScript

- 使用严格的类型定义
- 避免使用 `any`
- 导出必要的类型

### 命名规范

- 组件：PascalCase (`MyComponent`)
- 函数：camelCase (`handleClick`)
- 常量：UPPER_SNAKE_CASE (`MAX_COUNT`)
- 类型/接口：PascalCase (`MyInterface`)

## 📚 文档

如果您的更改影响到使用方式，请更新相关文档：

- `README.md` - 主文档
- `ROUTER_CONTEXT.md` - 技术详解
- `QUICK_REFERENCE.md` - 快速参考

## ✅ 提交前检查

- [ ] 代码通过 lint 检查
- [ ] 代码已格式化
- [ ] TypeScript 类型检查通过
- [ ] 更新了相关文档
- [ ] 测试了所有示例页面

## 🎯 改进建议

欢迎在以下方面提供改进：

- 更好的示例代码
- 文档的改进和补充
- 性能优化建议
- 新的使用模式
- Bug 修复

## 📧 联系方式

如有任何问题，欢迎：
- 创建 Issue
- 发起 Discussion
- 提交 Pull Request

感谢您的贡献！🎉

