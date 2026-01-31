<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent>
    <v-list-item class="py-4 px-3">
      <template v-slot:prepend>
        <span class="logo-commas">,,,</span>
      </template>
      <v-list-item-title class="text-subtitle-1 font-weight-bold">TC Sports</v-list-item-title>
      <v-list-item-subtitle class="text-caption text-medium-emphasis">Tres Comas Sports Hub</v-list-item-subtitle>
      <template v-slot:append>
        <v-btn variant="text" :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" @click="rail = !rail" size="small" />
      </template>
    </v-list-item>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-subheader v-if="!rail">{{ t.nav.navigation }}</v-list-subheader>
      
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :active="$route.path === item.to"
        color="primary"
      />
    </v-list>

    <template v-slot:append>
      <v-divider />
      
      <div class="pa-3">
        <div class="d-flex align-center justify-space-between mb-3" v-if="!rail">
          <span class="text-caption">{{ t.nav.theme }}</span>
          <v-btn-toggle v-model="theme" mandatory density="compact" variant="outlined" divided>
            <v-btn icon="mdi-weather-sunny" value="light" size="small" />
            <v-btn icon="mdi-weather-night" value="dark" size="small" />
          </v-btn-toggle>
        </div>
        <v-btn v-else icon="mdi-theme-light-dark" variant="text" @click="toggleTheme" />

        <v-menu v-if="!rail && auth.user">
          <template v-slot:activator="{ props }">
            <v-card v-bind="props" class="cursor-pointer" variant="tonal" color="surface">
              <v-card-text class="d-flex align-center pa-2">
                <v-avatar color="primary" size="36">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <div class="ml-3 overflow-hidden">
                  <div class="text-body-2 font-weight-medium text-truncate">{{ auth.user?.email }}</div>
                </div>
              </v-card-text>
            </v-card>
          </template>

          <v-list density="compact">
            <v-list-item :to="{ name: 'profile' }" prepend-icon="mdi-cog">
              <v-list-item-title>{{ t.user.profileSettings }}</v-list-item-title>
            </v-list-item>
            
            <v-menu location="end">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-translate">
                  <v-list-item-title>{{ t.user.language }}</v-list-item-title>
                </v-list-item>
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="setLanguage(lang.code)"
                >
                  <v-list-item-title>{{ lang.name }}</v-list-item-title>
                  <template v-slot:append v-if="language === lang.code">
                    <v-icon color="primary">mdi-check</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
            
            <v-divider />
            
            <v-list-item @click="handleSignOut" prepend-icon="mdi-logout" class="text-error">
              <v-list-item-title>{{ t.user.signOut }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn v-else-if="!auth.user" :to="{ name: 'login' }" color="primary" block :icon="rail ? 'mdi-login' : undefined">
          <span v-if="!rail">{{ t.user.signIn }}</span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

  <v-main>
    <slot />
    
    <v-footer class="border-t">
      <v-container class="text-center py-4">
        <p class="text-caption text-medium-emphasis mb-2">
          {{ t.common.poweredBy }} DPG Media {{ t.common.and }} Inkubis
        </p>
        <div class="d-flex justify-center ga-4">
          <img src="/images/dpg-media-logo.png" alt="DPG Media" height="24" class="rounded bg-white pa-1" />
          <img src="/images/inkubis-logo.svg" alt="Inkubis" height="24" class="rounded pa-1" />
        </div>
      </v-container>
    </v-footer>
  </v-main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguage } from '@/composables/useLanguage'

const vuetifyTheme = useTheme()
const router = useRouter()
const auth = useAuthStore()
const { t, language, setLanguage, languages } = useLanguage()

const drawer = ref(true)
const rail = ref(false)
const theme = ref(vuetifyTheme.global.name.value)

watch(theme, (val) => {
  vuetifyTheme.global.name.value = val
})

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const navItems = computed(() => {
  const items = [
    { to: '/', icon: 'mdi-home', title: t.value.nav.home },
    { to: '/live', icon: 'mdi-rss', title: t.value.nav.liveFeed },
  ]

  if (!auth.user) {
    items.push({ to: '/register', icon: 'mdi-account-plus', title: t.value.nav.register })
  } else {
    items.push(
      { to: '/interests', icon: 'mdi-heart', title: t.value.nav.interests },
      { to: '/archive', icon: 'mdi-archive', title: t.value.nav.myArchive },
      { to: '/preferences', icon: 'mdi-tune', title: t.value.nav.preferences },
    )
  }

  return items
})

const handleSignOut = async () => {
  await auth.signOut()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.logo-commas {
  font-size: 1.5rem;
  font-weight: 700;
  color: #A855F7;
  letter-spacing: -2px;
  margin-right: 4px;
}
</style>

