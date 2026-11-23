<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import {
  ArrowRight, ArrowUpRight, Bell, BookOpen, Check, CheckCheck, ChevronDown,
  ChevronRight, CircleHelp, Code2, Copy, ExternalLink, Eye, GalleryVerticalEnd,
  Github, Grid2X2, Layers3, LayoutGrid, Menu, Monitor, MoreHorizontal,
  MousePointer2, Palette, PanelLeftClose, PanelLeftOpen, Plus, RotateCcw,
  Settings2, SlidersHorizontal, Sparkles, SunMoon, X,
} from 'lucide-vue-next'
import {
  CheckboxIndicator, CheckboxRoot,
  DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal,
  DialogRoot, DialogTitle, DialogTrigger,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot,
  DropdownMenuSeparator, DropdownMenuTrigger,
  SelectContent, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal,
  SelectRoot, SelectTrigger, SelectValue, SelectViewport,
  SwitchRoot, SwitchThumb,
  TabsContent, TabsList, TabsRoot, TabsTrigger,
  TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger,
} from 'reka-ui'
import { isThemeId, tokens, type ThemeId } from './theme/themes'
import { useTheme } from './theme/useTheme'

const { theme, activeTheme, themes, setTheme } = useTheme()
type Page = 'overview' | 'components' | 'tokens'
const currentPage = ref<Page>('overview')
const sidebarOpen = ref(false)
const notifications = ref(true)
const autoUpdates = ref(false)
const agreement = ref(true)
const density = ref('comfortable')
const email = ref('')
const activeTab = ref('week')
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const nav = [
  { id: 'overview' as const, label: '总览', icon: LayoutGrid, code: '01' },
  { id: 'components' as const, label: '组件展示', icon: Layers3, code: '02' },
  { id: 'tokens' as const, label: '设计变量', icon: Palette, code: '03' },
]

const pageTitle = computed(() => ({ overview: '主题总览', components: '交互组件', tokens: '语义变量' })[currentPage.value])
const codeSnippet = computed(() => `/* ${activeTheme.value.name} — theme tokens */\n:root[data-theme="${theme.value}"] {\n  --page-bg: ${getToken('--page-bg')};\n  --surface: ${getToken('--surface')};\n  --text: ${getToken('--text')};\n  --accent: ${getToken('--accent')};\n  --border: ${getToken('--border')};\n  --radius: ${getToken('--radius')};\n}`)
function getToken(name: string) {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
function selectTheme(value: unknown) {
  if (isThemeId(value)) setTheme(value)
}
function toastMessage(message: string) {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}
function navigate(page: Page) {
  currentPage.value = page
  sidebarOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function copyTokens() {
  const value = tokens.map(t => `  ${t.name}: ${getToken(t.name)};`).join('\n')
  const payload = `:root[data-theme="${theme.value}"] {\n${value}\n}`
  if (!navigator.clipboard?.writeText) {
    toastMessage('浏览器不支持自动复制，请使用代码面板手动复制')
    return
  }
  navigator.clipboard.writeText(payload)
    .then(() => toastMessage('已复制当前主题的 CSS Variables'))
    .catch(() => toastMessage('复制权限被拒绝，请手动复制'))
}
function resetDemo() {
  notifications.value = true
  autoUpdates.value = false
  agreement.value = true
  density.value = 'comfortable'
  email.value = ''
  activeTab.value = 'week'
  toastMessage('组件演示状态已重置')
}
function cycleTheme() {
  const index = themes.findIndex(t => t.id === theme.value)
  setTheme(themes[(index + 1) % themes.length].id)
}
onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer) })
</script>

<template>
  <TooltipProvider :delay-duration="350">
    <div class="app-shell">
      <div v-if="sidebarOpen" class="mobile-backdrop" @click="sidebarOpen = false" />
      <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
        <div class="sidebar-header">
          <div class="brand-logo" aria-hidden="true"><i /><i /><i /><i /></div>
          <div class="brand-label"><strong>forma<span>.</span></strong><small>DESIGN FOUNDATION</small></div>
          <button class="sidebar-close icon-action" aria-label="关闭导航" @click="sidebarOpen = false"><X :size="18" /></button>
        </div>
        <div class="sidebar-content">
          <div class="nav-group-label">WORKSPACE <span>01</span></div>
          <nav aria-label="主导航" class="primary-nav">
            <button v-for="item in nav" :key="item.id" class="nav-item" :class="{ active: currentPage === item.id }" :aria-current="currentPage === item.id ? 'page' : undefined" @click="navigate(item.id)">
              <component :is="item.icon" :size="18" :stroke-width="1.8" />
              <span>{{ item.label }}</span><small>{{ item.code }}</small>
            </button>
          </nav>
          <div class="sidebar-rule" />
          <div class="nav-group-label">THEME LIBRARY <span>{{ String(themes.length).padStart(2,'0') }}</span></div>
          <div class="theme-nav">
            <button v-for="item in themes" :key="item.id" class="theme-nav-item" :class="{ active: theme === item.id }" :aria-pressed="theme === item.id" @click="setTheme(item.id)">
              <span class="theme-mini-swatch" :style="{ '--swatch-color': item.accent }" />
              <span>{{ item.name }}</span>
              <Check v-if="theme === item.id" :size="15" />
            </button>
          </div>
          <div class="sidebar-spacer" />
          <div class="aside-note">
            <div class="aside-note-icon"><Sparkles :size="16" /></div>
            <strong>风格与逻辑解耦</strong>
            <p>使用一套组件行为，探索多种视觉语言。</p>
            <button @click="navigate('tokens')">了解设计变量 <ArrowUpRight :size="13" /></button>
          </div>
        </div>
        <div class="sidebar-footer">
          <span class="avatar-mark">F</span>
          <span class="sidebar-footer-text"><strong>Foundation Kit</strong><small>Local Playground · v1.0</small></span>
          <a class="sidebar-footer-link" href="https://reka-ui.com" target="_blank" rel="noopener noreferrer" aria-label="访问 Reka UI 官网"><ExternalLink :size="15" /></a>
        </div>
      </aside>

      <div class="main-shell">
        <header class="topbar">
          <div class="breadcrumb">
            <button class="icon-action mobile-menu" aria-label="打开导航" @click="sidebarOpen = true"><Menu :size="20" /></button>
            <span class="breadcrumb-root">PLAYGROUND</span><ChevronRight :size="14" class="crumb-arrow" /><span>{{ pageTitle }}</span>
          </div>
          <div class="topbar-right">
            <div class="status-pill"><span class="status-dot" /> LIVE PREVIEW</div>
            <div class="header-divider" />
            <TooltipRoot>
              <TooltipTrigger class="icon-action top-action" aria-label="切换到下一个主题" @click="cycleTheme"><SunMoon :size="18" :stroke-width="1.8" /></TooltipTrigger>
              <TooltipPortal><TooltipContent class="tooltip" :side-offset="8">切换下一主题</TooltipContent></TooltipPortal>
            </TooltipRoot>
            <SelectRoot :model-value="theme" @update:model-value="selectTheme">
              <SelectTrigger class="theme-select-trigger" aria-label="选择全局主题">
                <span class="theme-selected-dot" :style="{ background: activeTheme.accent }" />
                <SelectValue :placeholder="activeTheme.name" />
                <ChevronDown :size="14" />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent position="popper" :side-offset="8" align="end" class="select-popover theme-picker-popover">
                  <div class="dropdown-caption">CHOOSE APPEARANCE</div>
                  <SelectViewport>
                    <SelectItem v-for="item in themes" :key="item.id" :value="item.id" class="select-option theme-option">
                      <span class="theme-selected-dot" :style="{ background: item.accent }" />
                      <SelectItemText>{{ item.name }}</SelectItemText>
                      <SelectItemIndicator class="option-check"><Check :size="15" /></SelectItemIndicator>
                    </SelectItem>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>
            <a class="top-icon-link" href="https://github.com/unovue/reka-ui" target="_blank" rel="noopener noreferrer" aria-label="Reka UI GitHub"><Github :size="18" /></a>
          </div>
        </header>

        <main class="content" id="main-content">
          <template v-if="currentPage === 'overview'">
            <section class="hero">
              <div class="hero-copy">
                <div class="eyebrow"><span class="eyebrow-line" /> INTRODUCING THE THEME STUDIO <span class="eyebrow-index">/ 001</span></div>
                <h1>One system.<br /><em>Many identities.</em></h1>
                <p class="hero-description">专注于风格，而非重复实现逻辑。基于 Reka UI 与语义化 Design Tokens，为每个界面赋予独特的视觉表达。</p>
                <div class="hero-actions">
                  <button class="button button-primary" @click="navigate('components')">探索组件 <ArrowUpRight :size="16" /></button>
                  <button class="button button-ghost" @click="navigate('tokens')">查看 Design Tokens <ArrowRight :size="16" /></button>
                </div>
              </div>
              <div class="hero-art" aria-hidden="true">
                <div class="art-grain" />
                <div class="orbit orbit-1" /><div class="orbit orbit-2" />
                <div class="art-floating art-floating-one"><span class="art-dot" /> <span>DESIGN IS A SYSTEM</span><MoreHorizontal :size="15" /></div>
                <div class="art-main-card">
                  <div class="art-card-top"><span>YOUR WORKSPACE</span><MoreHorizontal :size="17" /></div>
                  <div class="art-widget-number">84<span>.6</span><small>%</small></div>
                  <div class="art-progress"><span /></div>
                  <div class="art-bottom"><span>Visual consistency</span><span>+12.8% ↗</span></div>
                </div>
                <div class="art-floating art-floating-bottom"><div class="small-avatar">F</div><div><strong>Perfectly adaptable</strong><small>One click. New atmosphere.</small></div><CheckCheck :size="17" /></div>
                <div class="art-cross art-cross-1">+</div><div class="art-cross art-cross-2">+</div>
              </div>
            </section>

            <section class="metrics" aria-label="项目概览">
              <div class="metric"><div><strong>{{ String(themes.length).padStart(2,'0') }}</strong><span>精心设计的主题</span></div><Palette :size="19" :stroke-width="1.6" /></div>
              <div class="metric"><div><strong>20<span>+</span></strong><span>可复用语义变量</span></div><Layers3 :size="19" :stroke-width="1.6" /></div>
              <div class="metric"><div><strong>01</strong><span>统一组件交互层</span></div><MousePointer2 :size="19" :stroke-width="1.6" /></div>
            </section>

            <section class="section theme-section">
              <div class="section-heading"><div><div class="section-kicker">01 / VISUAL LANGUAGES</div><h2>探索主题系列 <span class="count-label">{{ String(themes.length).padStart(2,'0') }}</span></h2><p>选择任意风格，即刻改变整个工作台的视觉语言。</p></div><span class="section-detail">CURATED COLLECTION — 2026</span></div>
              <div class="theme-grid">
                <button v-for="(item, index) in themes" :key="item.id" class="theme-card" :class="{ selected: theme === item.id }" :aria-pressed="theme === item.id" @click="setTheme(item.id)">
                  <div class="theme-preview" :data-preview="item.id">
                    <div class="mini-toolbar"><span class="mini-mark">f<span>.</span></span><span class="mini-toolbar-center">Studio / Home</span><span class="mini-circles"><i /><i /><i /></span></div>
                    <div class="mini-main">
                      <div class="mini-heading"><span>Good morning, Alex.</span><span>↗</span></div>
                      <div class="mini-subtitle">Your creative space, reimagined.</div>
                      <div class="mini-panels"><div class="mini-panel"><div class="mini-panel-label">OVERVIEW</div><div class="mini-big-number">24.8k</div><div class="mini-chart"><i v-for="n in 9" :key="n" :style="{ height: `${25 + ((n * 13 + index * 11) % 65)}%` }" /></div></div><div class="mini-panel mini-panel-side"><div class="mini-icon">✦</div><div class="mini-small-lines"><i/><i/><i/></div><div class="mini-cta">Continue ↗</div></div></div>
                    </div>
                    <div v-if="theme === item.id" class="selected-badge"><Check :size="13" /> ACTIVE</div>
                  </div>
                  <div class="theme-card-details"><div class="theme-card-name"><strong>{{ item.name }}</strong><span>{{ item.zhName }}</span></div><div class="theme-card-foot"><small>{{ item.caption }}</small><span class="theme-card-arrow"><ArrowUpRight :size="16" /></span></div></div>
                </button>
              </div>
            </section>

            <section class="section showcase-section">
              <div class="section-heading"><div><div class="section-kicker">02 / REAL COMPONENTS</div><h2>真实交互，实时响应</h2><p>下面的控件使用 Reka UI 原语实现，切换主题时共享同一套行为逻辑。</p></div><button class="text-link" @click="navigate('components')">查看全部组件 <ArrowUpRight :size="15" /></button></div>
              <div class="showcase-grid">
                <div class="specimen-card button-specimen"><div class="specimen-heading"><span>01 — BUTTONS</span><span class="component-label">Actions</span></div><div class="specimen-body"><h3>Buttons & actions</h3><p>清晰的操作层级与状态反馈。</p><div class="control-row"><button class="button button-primary" @click="toastMessage('主操作执行成功')">Primary action <ArrowUpRight :size="15" /></button><button class="button button-secondary" @click="toastMessage('次级操作执行成功')">Secondary</button><button class="icon-button-square" aria-label="添加新项目" @click="toastMessage('已点击添加操作')"><Plus :size="17" /></button></div></div></div>
                <div class="specimen-card switch-specimen"><div class="specimen-heading"><span>02 — CONTROLS</span><span class="component-label">Preferences</span></div><div class="specimen-body"><h3>Preferences</h3><p>自然、轻量且明确的交互反馈。</p><div class="pref-row"><span class="pref-icon"><Bell :size="17" /></span><div><strong>Notification</strong><small>Receive important updates</small></div><SwitchRoot v-model="notifications" class="switch" aria-label="启用通知"><SwitchThumb class="switch-thumb" /></SwitchRoot></div><div class="pref-row"><span class="pref-icon"><Settings2 :size="17" /></span><div><strong>Auto updates</strong><small>Keep things in sync</small></div><SwitchRoot v-model="autoUpdates" class="switch" aria-label="启用自动更新"><SwitchThumb class="switch-thumb" /></SwitchRoot></div></div></div>
                <div class="specimen-card tabs-specimen"><div class="specimen-heading"><span>03 — NAVIGATION</span><span class="component-label">Tabs</span></div><div class="specimen-body"><h3>Activity overview</h3><p>支持键盘导航的标签面板。</p><TabsRoot v-model="activeTab" class="demo-tabs"><TabsList class="tabs-list"><TabsTrigger class="tab-trigger" value="week">This week</TabsTrigger><TabsTrigger class="tab-trigger" value="month">This month</TabsTrigger><TabsTrigger class="tab-trigger" value="year">This year</TabsTrigger></TabsList><TabsContent value="week" class="tab-content"><strong>12,480 <small>+18.6%</small></strong><span>本周访问量</span><div class="activity-bars"><i v-for="(bar,i) in [34,59,42,70,61,86,74]" :key="i" :style="{height:bar+'%'}" /></div></TabsContent><TabsContent value="month" class="tab-content"><strong>48,920 <small>+12.4%</small></strong><span>本月访问量</span><div class="activity-bars"><i v-for="(bar,i) in [40,55,65,48,90,73,81]" :key="i" :style="{height:bar+'%'}" /></div></TabsContent><TabsContent value="year" class="tab-content"><strong>582,100 <small>+26.1%</small></strong><span>本年访问量</span><div class="activity-bars"><i v-for="(bar,i) in [24,40,62,51,79,72,98]" :key="i" :style="{height:bar+'%'}" /></div></TabsContent></TabsRoot></div></div>
              </div>
            </section>
            <footer class="page-footer"><span>FORMA DESIGN FOUNDATION · BUILT ON REKA UI</span><span>THEME STUDIO / V1.0</span></footer>
          </template>

          <template v-else-if="currentPage === 'components'">
            <section class="inner-header"><div class="section-kicker">02 / COMPONENT LABORATORY</div><h1>Component <em>Playground.</em></h1><p>所有交互使用同一套 Reka UI 组件实现。更换主题，观察按钮、弹窗、表单与导航的整体变化。</p><div class="inner-actions"><span class="live-indicator"><span /> INTERACTIVE COMPONENTS</span><button class="button button-secondary button-sm" @click="resetDemo"><RotateCcw :size="14" /> 重置演示</button></div></section>
            <section class="component-grid">
              <div class="workbench-card"><div class="workbench-header"><span class="workbench-number">01</span><div><h3>Button</h3><p>Buttons & action hierarchy</p></div><span class="primitive-chip">HTML + CSS</span></div><div class="workbench-body"><div class="button-set"><button class="button button-primary" @click="toastMessage('已执行主要操作')">主要按钮 <ArrowUpRight :size="15" /></button><button class="button button-secondary" @click="toastMessage('已执行次要操作')">次要按钮</button><button class="button button-outline" @click="toastMessage('已执行轮廓按钮')">轮廓按钮</button><button class="button button-primary" disabled>禁用状态</button></div><p class="component-hint">按钮样式通过 CSS 变量复用，交互则使用原生 button 语义。</p></div></div>
              <div class="workbench-card"><div class="workbench-header"><span class="workbench-number">02</span><div><h3>Dialog</h3><p>Accessible overlay & focus trap</p></div><span class="primitive-chip">REKA UI</span></div><div class="workbench-body"><div class="dialog-demo"><div class="dialog-example-icon"><Layers3 :size="23" /></div><strong>Modal preview</strong><p>体验遮罩层、焦点约束及 Esc 关闭。</p><DialogRoot><DialogTrigger class="button button-primary">打开 Dialog <ArrowUpRight :size="15" /></DialogTrigger><DialogPortal><DialogOverlay class="dialog-overlay"/><DialogContent class="dialog-content"><div class="dialog-top"><div class="dialog-emblem"><Sparkles :size="21" /></div><DialogClose class="icon-action" aria-label="关闭弹窗"><X :size="19" /></DialogClose></div><DialogTitle class="dialog-title">Create something beautiful.</DialogTitle><DialogDescription class="dialog-description">统一的交互逻辑，呈现不同主题下的弹窗设计。你可以按 Esc、点击遮罩或使用关闭按钮退出。</DialogDescription><label class="field-label" for="dialog-project">项目名称</label><input id="dialog-project" class="text-input" placeholder="My creative project" /><div class="dialog-actions"><DialogClose class="button button-secondary">取消</DialogClose><DialogClose class="button button-primary" @click="toastMessage('已创建示例项目')">创建项目 <ArrowRight :size="15" /></DialogClose></div></DialogContent></DialogPortal></DialogRoot></div></div></div>
              <div class="workbench-card"><div class="workbench-header"><span class="workbench-number">03</span><div><h3>Switch & Checkbox</h3><p>Boolean state controls</p></div><span class="primitive-chip">REKA UI</span></div><div class="workbench-body"><div class="setting-row"><div><strong>推送通知</strong><small>接受系统与项目更新</small></div><SwitchRoot v-model="notifications" class="switch" aria-label="推送通知"><SwitchThumb class="switch-thumb" /></SwitchRoot></div><div class="setting-row"><div><strong>自动更新</strong><small>保持组件配置同步</small></div><SwitchRoot v-model="autoUpdates" class="switch" aria-label="自动更新"><SwitchThumb class="switch-thumb" /></SwitchRoot></div><div class="setting-row"><div><strong>接受示例条款</strong><small>自定义样式的复选框</small></div><CheckboxRoot v-model="agreement" class="checkbox" aria-label="接受示例条款"><CheckboxIndicator class="checkbox-indicator"><Check :size="13" :stroke-width="3" /></CheckboxIndicator></CheckboxRoot></div></div></div>
              <div class="workbench-card"><div class="workbench-header"><span class="workbench-number">04</span><div><h3>Select</h3><p>Keyboard searchable selection</p></div><span class="primitive-chip">REKA UI</span></div><div class="workbench-body"><label class="field-label" id="density-label">界面密度</label><SelectRoot v-model="density"><SelectTrigger class="field-select" aria-labelledby="density-label"><SelectValue placeholder="选择界面密度" /><ChevronDown :size="17" /></SelectTrigger><SelectPortal><SelectContent class="select-popover" position="popper" :side-offset="6"><SelectViewport><SelectItem v-for="option in [{value:'compact', label:'紧凑 Compact'},{value:'comfortable',label:'舒适 Comfortable'},{value:'spacious',label:'宽松 Spacious'}]" :key="option.value" :value="option.value" class="select-option"><SelectItemText>{{ option.label }}</SelectItemText><SelectItemIndicator class="option-check"><Check :size="15" /></SelectItemIndicator></SelectItem></SelectViewport></SelectContent></SelectPortal></SelectRoot><p class="component-hint">当前值：{{ {compact:'紧凑',comfortable:'舒适',spacious:'宽松'}[density as 'compact' | 'comfortable' | 'spacious'] }}</p><label class="field-label field-label-spaced" for="demo-email">邮箱地址</label><input id="demo-email" v-model="email" type="email" class="text-input" placeholder="hello@example.com" /><button class="button button-primary form-submit" @click="toastMessage(email.trim() ? `已记录示例邮箱：${email.trim()}` : '请输入邮箱地址')">保存偏好 <ArrowRight :size="15" /></button></div></div>
              <div class="workbench-card"><div class="workbench-header"><span class="workbench-number">05</span><div><h3>Dropdown Menu</h3><p>Popover positioning & keyboard control</p></div><span class="primitive-chip">REKA UI</span></div><div class="workbench-body"><DropdownMenuRoot><DropdownMenuTrigger class="button button-secondary">打开操作菜单 <ChevronDown :size="16" /></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent class="select-popover menu-popover" :side-offset="7" align="start"><div class="dropdown-caption">QUICK ACTIONS</div><DropdownMenuItem class="select-option" @select="toastMessage('已选择新建项目')"><Plus :size="15" /> 新建项目 <span class="keycap">N</span></DropdownMenuItem><DropdownMenuItem class="select-option" @select="toastMessage('已选择预览')"><Eye :size="15" /> 预览内容 <span class="keycap">P</span></DropdownMenuItem><DropdownMenuSeparator class="dropdown-separator" /><DropdownMenuItem class="select-option" @select="navigate('tokens')"><Code2 :size="15" /> 查看设计变量</DropdownMenuItem></DropdownMenuContent></DropdownMenuPortal></DropdownMenuRoot><p class="component-hint">支持方向键移动、Enter 确认与 Esc 关闭。</p></div></div>
              <div class="workbench-card"><div class="workbench-header"><span class="workbench-number">06</span><div><h3>Tabs & Tooltip</h3><p>Navigation and contextual guidance</p></div><span class="primitive-chip">REKA UI</span></div><div class="workbench-body"><TabsRoot default-value="details" class="compact-tabs"><TabsList class="tabs-list"><TabsTrigger value="details" class="tab-trigger">详情</TabsTrigger><TabsTrigger value="activity" class="tab-trigger">活动</TabsTrigger><TabsTrigger value="settings" class="tab-trigger">设置</TabsTrigger></TabsList><TabsContent value="details" class="compact-tab-panel">一个逻辑清晰、语义完整的标签面板。</TabsContent><TabsContent value="activity" class="compact-tab-panel">近期活动已成功展示。</TabsContent><TabsContent value="settings" class="compact-tab-panel">在这里管理你的显示偏好。</TabsContent></TabsRoot><div class="tooltip-demo"><span>将鼠标移到问号上：</span><TooltipRoot><TooltipTrigger class="icon-action" aria-label="关于组件可访问性"><CircleHelp :size="19" /></TooltipTrigger><TooltipPortal><TooltipContent class="tooltip" :side-offset="8">使用 Reka UI 管理焦点、角色与键盘操作</TooltipContent></TooltipPortal></TooltipRoot></div></div></div>
            </section>
            <div class="bottom-cta"><div class="bottom-cta-icon"><Palette :size="21" /></div><div><strong>视觉与交互彼此独立</strong><p>试试切换右上角主题，然后再次操作以上组件。</p></div><button class="button button-secondary" @click="navigate('overview')">切换主题 <ArrowUpRight :size="16" /></button></div>
            <footer class="page-footer"><span>FORMA DESIGN FOUNDATION · BUILT ON REKA UI</span><span>COMPONENT LIBRARY / V1.0</span></footer>
          </template>

          <template v-else>
            <section class="inner-header"><div class="section-kicker">03 / SEMANTIC DESIGN TOKENS</div><h1>Designed to <em>adapt.</em></h1><p>组件始终读取语义 Token，而不是写死的色值。这是让六种主题自由切换、未来扩展到更多风格的基础。</p><div class="inner-actions"><span class="live-indicator"><span /> {{ activeTheme.name.toUpperCase() }} THEME ACTIVE</span><button class="button button-secondary button-sm" @click="copyTokens"><Copy :size="14" /> 复制当前 Token</button></div></section>
            <section class="token-grid"><div v-for="token in tokens" :key="token.name" class="token-card"><div class="token-card-top"><span>{{ token.meaning }}</span><span v-if="token.swatch" class="token-swatch" :style="{ background: `var(${token.name})` }" /></div><strong>{{ token.name }}</strong><code>{{ getToken(token.name) || '—' }}</code></div></section>
            <section class="token-bottom"><div class="token-guide"><div class="section-kicker">HOW IT WORKS</div><h2>只改 Token，不改组件。</h2><p>所有视觉样式统一使用 <code>var(--token)</code>。主题切换时修改根节点的 <code>data-theme</code>，位于 Portal 中的菜单和弹窗也能够继承同一套变量。</p><ul><li><Check :size="15" /> CSS Variables：控制视觉样式</li><li><Check :size="15" /> Reka UI Primitives：管理底层交互</li><li><Check :size="15" /> LocalStorage：记忆当前主题</li><li><Check :size="15" /> 单一主题 ID：集中管理状态</li></ul></div><div class="code-panel"><div class="code-panel-title"><span class="code-dots"><i/><i/><i/></span><span>theme.css</span><button aria-label="复制 CSS" @click="copyTokens"><Copy :size="15" /></button></div><pre><code>{{ codeSnippet }}</code></pre></div></section>
            <footer class="page-footer"><span>FORMA DESIGN FOUNDATION · BUILT ON REKA UI</span><span>DESIGN TOKENS / V1.0</span></footer>
          </template>
        </main>
      </div>
      <Transition name="toast"><div v-if="toast" class="toast-message" role="status"><span class="toast-check"><Check :size="15" /></span><span>{{ toast }}</span><button class="toast-close" aria-label="关闭提示" @click="toast = ''"><X :size="15" /></button></div></Transition>
    </div>
  </TooltipProvider>
</template>
