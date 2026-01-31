<template>
  <AppLayout>
    <v-container class="py-12">
      <div class="d-flex flex-column align-center text-center">
        <v-img
          src="/images/tres-comas.png"
          alt="Tres Comas - Three bulls with sombreros"
          width="100%"
          max-width="700"
          aspect-ratio="16/9"
          class="rounded-xl mb-8"
          cover
        />

        <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
          {{ t.home.welcome }} <span class="text-primary">TC Sports</span>
        </h1>
        
        <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 600px;">
          {{ t.home.description }}
        </p>

        <div class="d-flex flex-column flex-sm-row ga-4 mb-12">
          <v-btn :to="{ name: 'register' }" color="primary" size="large" min-width="180" rounded="pill" class="px-8">
            {{ t.home.getStarted }}
          </v-btn>
          <v-btn :to="{ name: 'live' }" variant="outlined" color="primary" size="large" min-width="180" rounded="pill" class="px-8">
            {{ t.home.browseArticles }}
          </v-btn>
        </div>

        <v-row class="w-100" style="max-width: 1000px;">
          <v-col cols="12" md="4" v-for="feature in features" :key="feature.title">
            <v-card variant="outlined" class="h-100 pa-6 text-left feature-card">
              <h3 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
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

<style scoped>
.feature-card {
  transition: all 0.2s ease;
  border-color: rgba(160, 160, 184, 0.2) !important;
}
.feature-card:hover {
  border-color: rgba(168, 85, 247, 0.5) !important;
}
</style>
