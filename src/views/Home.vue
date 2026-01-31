<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col items-center gap-8 text-center">
        <div class="relative h-64 w-full max-w-2xl overflow-hidden rounded-2xl">
          <img
            src="/images/tres-comas.png"
            alt="Tres Comas - Three bulls with sombreros"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="flex flex-col items-center gap-4">
          <h1 class="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {{ t.home.welcome }} <span class="text-primary">TC Sports</span>
          </h1>
          <p class="max-w-xl text-pretty text-lg text-muted-foreground">
            {{ t.home.description }}
          </p>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row">
          <router-link
            :to="{ name: 'register' }"
            class="inline-flex min-w-[160px] items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {{ t.home.getStarted }}
          </router-link>
          <router-link
            :to="{ name: 'live' }"
            class="inline-flex min-w-[160px] items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {{ t.home.browseArticles }}
          </router-link>
        </div>

        <div class="mt-12 grid w-full max-w-4xl gap-6 md:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/50"
          >
            <h3 class="mb-2 text-lg font-semibold text-card-foreground">{{ feature.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const features = computed(() => [
  {
    title: t.value.home.features.personalized,
    description: t.value.home.features.personalizedDesc,
  },
  {
    title: t.value.home.features.liveUpdates,
    description: t.value.home.features.liveUpdatesDesc,
  },
  {
    title: t.value.home.features.archive,
    description: t.value.home.features.archiveDesc,
  },
])
</script>
