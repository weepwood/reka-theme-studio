import { computed, onMounted, ref, watch } from 'vue'
import { DEFAULT_THEME, isThemeId, STORAGE_KEY, themes, type ThemeId } from './themes'

// App-level state. If needed elsewhere, move the ref to a Pinia store or inject it.
const currentTheme = ref<ThemeId>(DEFAULT_THEME)

export function useTheme() {
  const activeTheme = computed(() => themes.find(t => t.id === currentTheme.value) ?? themes[0])

  function setTheme(id: ThemeId) {
    currentTheme.value = id
  }

  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (isThemeId(saved)) currentTheme.value = saved
    } catch {
      // Browsers with storage disabled can still switch themes for this session.
    }
    applyTheme(currentTheme.value)
  })

  watch(currentTheme, applyTheme)

  return { theme: currentTheme, activeTheme, setTheme, themes }
}

function applyTheme(id: ThemeId) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = id
  const theme = themes.find(t => t.id === id) ?? themes[0]
  document.documentElement.style.colorScheme = theme.dark ? 'dark' : 'light'
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--page-bg').trim() || (theme.dark ? '#14151b' : '#f5f6f9'))
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Ignore blocked or full storage.
  }
}
