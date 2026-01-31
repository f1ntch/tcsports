<template>
  <div class="flex min-h-screen w-full">
    <!-- Sidebar -->
    <aside
      class="relative z-30 hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200"
      :class="rail ? 'w-16' : 'w-64'"
    >
      <div class="flex flex-col gap-2 p-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-bold text-primary">,,,</span>
          <div v-if="!rail" class="flex flex-col">
            <span class="text-lg font-bold leading-tight text-sidebar-foreground">TC Sports</span>
            <span class="text-xs text-sidebar-foreground/70">Tres Comas Sports Hub</span>
          </div>
          <button
            v-if="!rail"
            type="button"
            class="ml-auto rounded-md p-1.5 hover:bg-sidebar-accent"
            @click="rail = true"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button
            v-else
            type="button"
            class="mx-auto rounded-full bg-primary p-2 text-primary-foreground shadow-md hover:bg-primary/90"
            @click="rail = false"
            aria-label="Expand sidebar"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="mx-2 h-px bg-sidebar-border" />

      <nav class="flex min-h-0 flex-1 flex-col gap-1 overflow-auto p-2">
        <p v-if="!rail" class="px-2 py-2 text-xs font-medium text-sidebar-foreground/70">
          {{ t.nav.navigation }}
        </p>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          :class="[
            $route.path === item.to
              ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
              : '',
            rail ? 'justify-center p-2' : '',
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span v-if="!rail" class="truncate">{{ item.title }}</span>
        </router-link>
      </nav>

      <div class="mx-2 h-px bg-sidebar-border" />

      <div class="flex flex-col gap-2 p-4">
        <div v-if="auth.user" class="relative">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent"
            @click="userMenuOpen = !userMenuOpen"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User class="h-4 w-4" />
            </div>
            <div v-if="!rail" class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-sidebar-foreground">{{ auth.user?.email }}</p>
            </div>
          </button>

          <div
            v-if="userMenuOpen"
            class="absolute bottom-full left-0 right-0 mb-1 rounded-md border border-border bg-popover p-1 shadow-lg"
          >
            <router-link
              :to="{ name: 'profile' }"
              class="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
              @click="userMenuOpen = false"
            >
              <Settings class="h-4 w-4" />
              {{ t.user.profileSettings }}
            </router-link>
            <div class="relative" ref="langMenuRef">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
                @click="langMenuOpen = !langMenuOpen"
              >
                <Globe class="h-4 w-4" />
                {{ t.user.language }}
              </button>
              <div
                v-if="langMenuOpen"
                class="absolute left-full top-0 ml-1 min-w-[120px] rounded-md border border-border bg-popover p-1 shadow-lg"
              >
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  class="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
                  @click="setLanguage(lang.code); langMenuOpen = false"
                >
                  {{ lang.name }}
                  <Check v-if="language === lang.code" class="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
            <div class="my-1 h-px bg-border" />
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              @click="handleSignOut"
            >
              <LogOut class="h-4 w-4" />
              {{ t.user.signOut }}
            </button>
          </div>
        </div>

        <router-link
          v-else
          :to="{ name: 'login' }"
          class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          :class="rail ? 'p-2' : ''"
        >
          <LogIn v-if="rail" class="h-4 w-4" />
          <span v-else>{{ t.user.signIn }}</span>
        </router-link>
      </div>
    </aside>

    <!-- Mobile header + drawer -->
    <header
      class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden"
    >
      <button
        type="button"
        class="-ml-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
        aria-label="Open menu"
        @click="mobileMenuOpen = true"
      >
        <PanelLeft class="h-5 w-5" />
      </button>
      <span class="text-lg font-bold text-primary">,,,</span>
      <span class="font-semibold text-foreground">TC Sports</span>
      <router-link
        v-if="!auth.user"
        :to="{ name: 'login' }"
        class="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <LogIn class="h-4 w-4" />
        {{ t.user.signIn }}
      </router-link>
    </header>

    <!-- Mobile drawer backdrop -->
    <div
      v-show="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/50 md:hidden"
      aria-hidden="true"
      @click="mobileMenuOpen = false"
    />

    <!-- Mobile drawer -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 ease-out md:hidden"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between gap-2 border-b border-sidebar-border p-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold text-primary">,,,</span>
          <div class="flex flex-col">
            <span class="text-lg font-bold leading-tight text-sidebar-foreground">TC Sports</span>
            <span class="text-xs text-sidebar-foreground/70">Tres Comas Sports Hub</span>
          </div>
        </div>
        <button
          type="button"
          class="rounded-md p-2 hover:bg-sidebar-accent"
          aria-label="Close menu"
          @click="mobileMenuOpen = false"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      <nav class="flex min-h-0 flex-1 flex-col gap-1 overflow-auto p-2">
        <p class="px-2 py-2 text-xs font-medium text-sidebar-foreground/70">{{ t.nav.navigation }}</p>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          :class="
            $route.path === item.to
              ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
              : ''
          "
          @click="mobileMenuOpen = false"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span class="truncate">{{ item.title }}</span>
        </router-link>
      </nav>
      <div class="mx-2 h-px bg-sidebar-border" />
      <div class="flex flex-col gap-2 p-4">
        <div class="mb-4 flex items-center justify-between">
          <span class="text-xs text-sidebar-foreground/70">{{ t.nav.theme }}</span>
          <div class="flex rounded-md border border-sidebar-border p-0.5">
            <button
              type="button"
              class="rounded p-1.5 transition-colors"
              :class="!isDark ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent'"
              @click="setTheme(false)"
              aria-label="Light theme"
            >
              <Sun class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="rounded p-1.5 transition-colors"
              :class="isDark ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent'"
              @click="setTheme(true)"
              aria-label="Dark theme"
            >
              <Moon class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div v-if="auth.user" class="relative">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent"
            @click="userMenuOpen = !userMenuOpen"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User class="h-4 w-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-sidebar-foreground">{{ auth.user?.email }}</p>
            </div>
          </button>
          <div
            v-if="userMenuOpen"
            class="absolute bottom-full left-0 right-0 mb-1 rounded-md border border-border bg-popover p-1 shadow-lg"
          >
            <router-link
              :to="{ name: 'profile' }"
              class="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
              @click="userMenuOpen = false; mobileMenuOpen = false"
            >
              <Settings class="h-4 w-4" />
              {{ t.user.profileSettings }}
            </router-link>
            <div class="relative">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
                @click="langMenuOpen = !langMenuOpen"
              >
                <Globe class="h-4 w-4" />
                {{ t.user.language }}
              </button>
              <div
                v-if="langMenuOpen"
                class="absolute left-0 right-0 top-full mt-1 rounded-md border border-border bg-popover p-1 shadow-lg"
              >
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  class="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-accent"
                  @click="setLanguage(lang.code); langMenuOpen = false"
                >
                  {{ lang.name }}
                  <Check v-if="language === lang.code" class="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
            <div class="my-1 h-px bg-border" />
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              @click="handleSignOut"
            >
              <LogOut class="h-4 w-4" />
              {{ t.user.signOut }}
            </button>
          </div>
        </div>
        <router-link
          v-else
          :to="{ name: 'login' }"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          @click="mobileMenuOpen = false"
        >
          {{ t.user.signIn }}
        </router-link>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-1 flex-col">
      <!-- Top bar -->
      <header class="sticky top-0 z-20 hidden border-b border-border bg-background md:block">
        <div class="container mx-auto flex h-12 items-center justify-end gap-4 px-4">
          <!-- Language selector -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent"
              @click="topLangOpen = !topLangOpen"
            >
              <Globe class="h-4 w-4" />
              <span>{{ currentLangName }}</span>
            </button>
            <div
              v-if="topLangOpen"
              class="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-md border border-border bg-popover p-1 shadow-lg"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                class="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                @click="setLanguage(lang.code); topLangOpen = false"
              >
                {{ lang.name }}
                <Check v-if="language === lang.code" class="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>

          <!-- Theme toggle -->
          <div class="flex items-center gap-1 rounded-md border border-input p-0.5">
            <button
              type="button"
              class="rounded p-1.5 transition-colors"
              :class="!isDark ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
              @click="setTheme(false)"
              aria-label="Light theme"
            >
              <Sun class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="rounded p-1.5 transition-colors"
              :class="isDark ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'"
              @click="setTheme(true)"
              aria-label="Dark theme"
            >
              <Moon class="h-4 w-4" />
            </button>
          </div>

          <!-- Sign In button -->
          <router-link
            v-if="!auth.user"
            :to="{ name: 'login' }"
            class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <LogIn class="h-4 w-4" />
            {{ t.user.signIn }}
          </router-link>
          <button
            v-else
            type="button"
            class="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent"
            @click="handleSignOut"
          >
            <LogOut class="h-4 w-4" />
            {{ t.user.signOut }}
          </button>
        </div>
      </header>

      <main class="flex-1">
        <slot />
      </main>

      <footer class="border-t border-border bg-card">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col items-center gap-4">
            <p class="text-sm text-muted-foreground">
              {{ t.common.poweredBy }} DPG Media {{ t.common.and }} Inkubis
            </p>
            <div class="flex items-center gap-8">
              <img src="/images/dpg-media-logo.png" alt="DPG Media" class="h-24 rounded bg-white p-2" />
              <img src="/images/inkubis-logo.svg" alt="Inkubis" class="h-24 rounded p-2 dark:bg-[#1a1035]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home,
  Rss,
  UserPlus,
  Heart,
  Archive,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User,
  Settings,
  Globe,
  Check,
  LogOut,
  ShoppingBag,
  LogIn,
  PanelLeft,
  X,
  Trophy,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useLanguage } from '@/composables/useLanguage'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const auth = useAuthStore()
const { t, language, setLanguage, languages } = useLanguage()
const { isDark, toggle: toggleTheme, setTheme } = useTheme()

const rail = ref(false)
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const langMenuOpen = ref(false)
const langMenuRef = ref(null)
const topLangOpen = ref(false)

const currentLangName = computed(() => {
  const lang = languages.find(l => l.code === language.value)
  return lang?.name || 'EN'
})

const closeMenus = (e) => {
  if (!e.target.closest('.relative')) {
    userMenuOpen.value = false
    langMenuOpen.value = false
    topLangOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
})
onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})

const navItems = computed(() => {
  const items = [
    { to: '/', icon: Home, title: t.value.nav.home },
    { to: '/live', icon: Rss, title: t.value.nav.liveFeed },
    { to: '/matches', icon: Trophy, title: t.value.nav.matches },
    { to: '/shop', icon: ShoppingBag, title: t.value.nav.shop },
  ]
  if (!auth.user) {
    items.push({ to: '/register', icon: UserPlus, title: t.value.nav.register })
  } else {
    items.push(
      { to: '/interests', icon: Heart, title: t.value.nav.interests },
      { to: '/archive', icon: Archive, title: t.value.nav.myArchive },
      { to: '/preferences', icon: SlidersHorizontal, title: t.value.nav.preferences }
    )
  }
  return items
})

const handleSignOut = async () => {
  userMenuOpen.value = false
  await auth.signOut()
  router.push({ name: 'home' })
}
</script>
