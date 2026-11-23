# Forma — Reka UI Theme Studio

一个可直接作为 Vue 3 设计系统实验起点的多主题演示项目。它不是截图或静态模板，使用真实的 Reka UI 原语提供 Dialog / Select / Tabs / Switch / Checkbox / Dropdown Menu / Tooltip 交互，并在整个页面上统一使用语义化 CSS Variables。

## 离线预览

直接双击 `preview.html`，可以在不安装依赖的情况下预览页面外观并切换七套主题。它是**独立的视觉预览**，不是使用 Reka UI 构建的真实组件演示；完整交互请运行 Vue 应用。

## 启动

需要 Node.js 20.19+ 或 22.12+，并且可以访问 npm Registry。

```bash
npm install
npm run dev
```

浏览器打开终端中的本地地址（默认 http://localhost:5173）。

生产构建与静态部署：

```bash
npm run build
npm run preview
```

`dist/` 可以部署在 GitHub Pages、Netlify 或任何静态托管服务。Vite 配置中 `base: './'`，适用于仓库子路径。

## 主题清单

| ID | 风格 | 用途 |
|---|---|---|
| `porcelain` | 瓷白极简 | 常规生产力工具 |
| `midnight` | 午夜深色 | 低眩光工作台 |
| `lavender` | 柔雾薰衣草 | 柔和、轻玻璃层次 |
| `parchment` | 暖纸编辑 | 文艺与内容阅读 |
| `evergreen` | 常青森林 | 深绿自然风格 |
| `brutalist` | 新粗野主义 | 强对比与硬边框 |
| `boardui` | BoardUI 精密工作台 | 细腻中性色、渐变交互控件、轻量浮层 |

主题同时控制整体背景、导航、文字、边框、强调色、表面、卡片阴影、圆角、按钮和所有弹出层；点击侧边栏主题或右上角选择器即可切换，并通过 `localStorage` 记忆。单击右上角日月图标可依次轮换主题。

### BoardUI 风格适配

`boardui` 主题参考 [BoardUI/boardui](https://github.com/BoardUI/boardui) 的公开设计 Token 与基础组件视觉规范（MIT License），在不引入其 React/Next 组件逻辑的前提下，将按钮、输入框、Select/Dropdown、Checkbox、Switch、Tabs、侧栏选中态、卡片与 Dialog 的视觉配方适配到现有 Reka UI 原语上。

## 架构

```text
src/
├── main.ts
├── App.vue                # 主题画廊 / 交互组件 / Token 检视
├── style.css              # 所有组件的主题无关外观规则
└── theme/
    ├── themes.ts          # 主题元信息、ID 与 Token 展示表
    ├── theme.css          # 每套主题的 CSS 语义变量
    └── useTheme.ts        # 全局状态、主题写入及本地记忆
tests/
└── themes.test.mjs        # 主题覆盖与 Reka UI 使用的结构测试
```

关键点：

1. **Reka UI 管交互**：Select、Dialog、Tabs 等的焦点、键盘导航、状态交给 Reka UI。
2. **CSS Variables 管外观**：组件声明 `background: var(--surface)` 等语义变量，不直接写主题色。
3. **主题作用于 `<html>`**：通过 `document.documentElement.dataset.theme = id` 设置。因此 Reka UI Teleport / Portal 到 `body` 的弹窗和菜单也能读取对应主题。
4. **主题预览独立作用域**：预览卡片的 `data-preview` 使用同一套 CSS Tokens，即使主页面切到深色，也能同时展示全部七种风格。
5. **不依赖 Tailwind**：使用原生 CSS，便于向普通 Vue 应用和 Tauri / Electron WebView 迁移。

## 新增一套主题

1. 在 `src/theme/themes.ts` 的 `themes` 数组中添加 ID、名称、描述、强调色及 dark 标记。
2. 在 `src/theme/theme.css` 增加下面的选择器，提供所有现有语义变量：

```css
:root[data-theme="new-theme"],
[data-preview="new-theme"] {
  --page-bg: #f5f5f5;
  --surface: #ffffff;
  --text: #222222;
  --accent: #4b67c8;
  /* 复制一套完整 token 继续调整 */
}
```

3. 在 `index.html` 预加载主题时的 `available` 数组加入 ID，避免刷新后闪烁。
4. 将新增 ID 加入 `tests/themes.test.mjs` 并运行 `npm test`。完整主题必须包含测试列出的所有必需变量。

## 验证

```bash
npm test      # Node 原生测试，不依赖 npm install
npm run build # TypeScript + Vite 生产构建，需要先安装依赖
```

> 当前交付环境无法访问 npm Registry，因此已完成代码结构检查、CSS 解析和原生结构测试，但尚未实际下载依赖或执行 Vite 打包。请在可联网环境运行 `npm install && npm run build` 进行最终验证。

## 后续拆分建议

当前是专注主题系统的完整演示工作台；要将其发展成组件库，可以逐步将页面内示例抽成 `src/components/ui/` 的 `UiDialog.vue`、`UiSelect.vue`、`UiSwitch.vue`，统一包装 Reka UI，并把语义 Token 作为独立 `@your-scope/tokens` 包。React 项目可共享 Token，但需要使用 Base UI 等 React 原语单独实现组件。

参考：<https://reka-ui.com/docs/overview/introduction> · <https://reka-ui.com/docs/components/dialog> · <https://reka-ui.com/docs/components/select>
