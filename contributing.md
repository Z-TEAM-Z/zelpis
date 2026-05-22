---
url: /zelpis/contributing.md
---
# 贡献指南

感谢您对 Zelpis 项目的兴趣！我们欢迎并鼓励社区贡献。本指南将帮助您了解如何为 Zelpis 项目做出贡献。

## 贡献方式

您可以通过以下方式为 Zelpis 项目做出贡献：

1. **参与开发**：基于 Zelpis 项目的代码库，fork 仓库后克隆到本地环境。
2. **报告问题**：在 GitHub Issues 中报告 bug 或提出新功能建议
3. **提交代码**：通过 Pull 到 fork 的仓库后 提交一个PR，等待代码审查。
4. **改进文档**：完善项目文档，存放在docs目录中。
5. **回答问题**：在 GitHub Issues 或社区中回答其他用户的问题
6. **分享经验**：在博客、社交媒体等平台分享您使用 Zelpis 的经验

## 开发环境设置

### 1. 克隆仓库，先 fork zelpis 的仓库，在克隆仓库开发

```bash
fork https://github.com/xxxxx/zelpis.git
git clone https://github.com/xxxxx/zelpis.git
cd zelpis
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建项目

```bash
pnpm build
```

### 4. 运行示例

```bash
# 运行 React 示例
cd examples/react-example
pnpm dev

# 运行 Vue 示例
cd examples/vue-example
pnpm dev
```

## 代码规范

Zelpis 项目使用以下代码规范：

* **TypeScript**：使用 TypeScript 进行类型检查
* **ESLint**：使用 ESLint（`@antfu/eslint-config`）进行代码风格与格式相关检查

### 运行代码检查

```bash
# 运行类型检查
pnpm typecheck

# 运行代码风格检查
pnpm lint

# 运行测试（根目录已配置 vitest）
pnpm test
```

## 提交代码

### 1. 创建分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 提交更改

Zelpis 项目使用 Commitlint 来规范提交信息。提交信息应遵循以下格式：

**类型**：

* `feat`：新功能
* `fix`：bug 修复
* `docs`：文档更新
* `style`：代码风格调整
* `refactor`：代码重构
* `test`：测试更新
* `chore`：构建或依赖更新

**示例**：

```text
feat(render): add support for custom render options
```

### 3. 推送分支

```bash
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

在 GitHub 上创建 Pull Request，描述您的更改并链接相关的 Issue（如果有）。

## 代码审查

所有 Pull Request 都会经过代码审查。请确保：

1. 代码符合项目的代码规范
2. 所有测试都通过
3. 更改有适当的文档
4. 提交信息清晰明了

## 发布流程（联系负责人）

Zelpis 项目使用语义化版本控制。发布流程如下：

1. 运行测试和检查
2. 更新版本号
3. 生成发布说明
4. 发布到 npm

## 行为准则

参与 Zelpis 项目的所有贡献者都应遵循以下行为准则：

* 尊重他人，友善交流
* 接受建设性批评
* 关注问题本身，不进行人身攻击
* 对新人友好，提供帮助

## 联系我们

如果您有任何问题或建议，可以通过以下方式联系我们：

* **GitHub Issues**：在项目仓库中创建 Issue

感谢您的贡献！
