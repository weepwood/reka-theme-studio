import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const css = readFileSync(new URL('../src/theme/theme.css', import.meta.url), 'utf8')
const ui = readFileSync(new URL('../src/App.vue', import.meta.url), 'utf8')
const manager = readFileSync(new URL('../src/theme/useTheme.ts', import.meta.url), 'utf8')
const ids = ['porcelain', 'midnight', 'lavender', 'parchment', 'evergreen', 'brutalist', 'boardui']
const required = [
  '--page-bg', '--sidebar-bg', '--surface', '--surface-alt', '--surface-hover',
  '--text', '--text-strong', '--muted', '--faint', '--border', '--border-strong',
  '--accent', '--accent-text', '--accent-soft', '--accent-contrast', '--accent-subtle',
  '--hero-bg', '--hero-orbit', '--hero-spark', '--art-card', '--shadow-card',
  '--shadow-float', '--radius', '--radius-lg', '--radius-xl', '--font-display',
  '--border-weight',
]
function definition(theme) {
  const marker = theme === 'porcelain' ? ':root[data-theme="porcelain"]' : `:root[data-theme="${theme}"]`
  const start = css.indexOf(marker)
  assert.ok(start > -1, `Missing CSS declaration for ${theme}`)
  const bodyStart = css.indexOf('{', start)
  const bodyEnd = css.indexOf('}', bodyStart)
  return css.slice(bodyStart, bodyEnd)
}
test('all seven themes provide every required semantic token', () => {
  for (const id of ids) {
    const block = definition(id)
    for (const token of required) {
      assert.match(block, new RegExp(`(?:^|\\s)${token}:`), `${id} missing ${token}`)
    }
    assert.ok(css.includes(`[data-preview="${id}"]`), `${id} missing thumbnail preview`)
  }
})
test('global theme state applies at html root, including teleported overlays', () => {
  assert.match(manager, /document\.documentElement\.dataset\.theme = id/)
  assert.match(manager, /localStorage\.setItem\(STORAGE_KEY, id\)/)
})
test('primitive interactions are sourced from Reka UI', () => {
  for (const primitive of ['DialogRoot', 'SelectRoot', 'SwitchRoot', 'TabsRoot', 'DropdownMenuRoot', 'CheckboxRoot', 'TooltipRoot']) {
    assert.match(ui, new RegExp(`<${primitive}\\b`), `Missing live usage of ${primitive}`)
  }
})
