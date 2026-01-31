<template>
  <AppLayout>
    <div class="container mx-auto max-w-[1000px] px-4 py-12">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold md:text-3xl">{{ t.interests.title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t.interests.subtitle }}</p>
      </div>

      <div v-if="saved" class="flex justify-center">
        <div class="w-full max-w-[400px] rounded-xl border border-border bg-card p-8 text-center">
          <CheckCircle class="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 class="text-xl font-semibold">{{ t.interests.successTitle }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ t.interests.successMessage }}</p>
        </div>
      </div>

      <div v-else-if="loadingSports" class="flex justify-center py-16">
        <Loader2 class="h-12 w-12 animate-spin text-primary" />
      </div>

      <template v-else>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="sport in sports"
            :key="sport.id"
            type="button"
            class="flex flex-col rounded-xl border bg-card p-5 text-left transition-colors hover:border-primary/50"
            :class="[
              isSelected(sport.id)
                ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)]'
                : 'border-border',
            ]"
            @click="toggleSport(sport.id)"
          >
            <div class="mb-4 flex items-center justify-between">
              <span class="font-semibold">{{ sport.name }}</span>
              <div
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                :class="isSelected(sport.id) ? 'border-primary bg-primary' : 'border-muted-foreground/30'"
              >
                <Check v-if="isSelected(sport.id)" class="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            </div>
            <p class="text-sm text-muted-foreground">{{ sport.description }}</p>
          </button>
        </div>

        <div class="mt-8 flex flex-col items-center">
          <p v-if="selectedSports.length" class="mb-4 text-sm text-muted-foreground">
            {{ selectedSports.length }} {{ t.interests.selected }}
          </p>
          <button
            type="button"
            class="inline-flex min-w-[200px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            :disabled="!selectedSports.length || loading"
            @click="handleSave"
          >
            <span v-if="loading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {{ loading ? t.interests.saving : t.interests.saveInterests }}
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle, Check, Loader2 } from 'lucide-vue-next'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const auth = useAuthStore()
const { t } = useLanguage()

const sports = ref([])
const selectedSports = ref([])
const loading = ref(false)
const loadingSports = ref(true)
const saved = ref(false)

async function fetchSports() {
  const { data } = await supabase
    .from('sports')
    .select('id, name')
    .order('name')
  
  if (data) {
    sports.value = data.map(s => ({
      id: s.id,
      name: s.name,
      description: `Follow ${s.name} news and updates`
    }))
  }
  loadingSports.value = false
}

async function fetchUserInterests() {
  if (!auth.user) return
  const { data } = await supabase
    .from('user_interests')
    .select('sport_id')
    .eq('user_id', auth.user.id)
  
  if (data) {
    selectedSports.value = data.map(d => d.sport_id)
  }
}

const isSelected = (id) => selectedSports.value.includes(id)

const toggleSport = (id) => {
  const idx = selectedSports.value.indexOf(id)
  if (idx >= 0) {
    selectedSports.value.splice(idx, 1)
  } else {
    selectedSports.value.push(id)
  }
}

const handleSave = async () => {
  if (!selectedSports.value.length || !auth.user) return
  loading.value = true

  // Delete existing interests
  await supabase
    .from('user_interests')
    .delete()
    .eq('user_id', auth.user.id)

  // Insert new interests
  const inserts = selectedSports.value.map(sportId => ({
    user_id: auth.user.id,
    sport_id: sportId
  }))
  
  await supabase.from('user_interests').insert(inserts)

  loading.value = false
  saved.value = true
  setTimeout(() => router.push({ name: 'home' }), 2000)
}

onMounted(() => {
  fetchSports()
  fetchUserInterests()
})
</script>
