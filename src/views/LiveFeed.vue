<template>
  <v-container>
    <v-snackbar v-model="showMessage" color="primary" timeout="3000" location="top">
      <v-icon start>mdi-refresh</v-icon>
      Checking for fresh news...
    </v-snackbar>

    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">
        <v-icon color="error" class="mr-2">mdi-broadcast</v-icon>
        Live Feed
      </h1>
      <v-chip color="primary" size="large" variant="elevated">
        <v-icon start>mdi-newspaper</v-icon>
        {{ articles.length }} Live
      </v-chip>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-col>
    </v-row>

    <v-row v-else-if="articles.length === 0">
      <v-col cols="12">
        <v-alert type="info">No fresh articles at the moment</v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="article in articles" :key="article.id" cols="12" md="4">
        <v-card class="h-100" elevation="4">
          <v-card-item>
            <v-chip color="error" size="small" class="mb-2">
              <v-icon start size="x-small">mdi-circle</v-icon>
              LIVE
            </v-chip>
            <v-card-title class="text-wrap">{{ article.title }}</v-card-title>
            <v-card-subtitle>{{ article.source }} • {{ formatDate(article.created_at) }}</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div v-html="truncate(article.body, 150)" />
          </v-card-text>
          <v-card-actions>
            <v-chip size="small" variant="outlined">{{ article.language_code }}</v-chip>
            <v-spacer />
            <v-btn variant="text" color="primary">Read More</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'

const articles = ref([])
const loading = ref(true)
const showMessage = ref(false)
let interval = null

async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('indicator', 1)
    .order('id', { ascending: false })

  if (!error) articles.value = data
  loading.value = false
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function truncate(text, len) {
  if (!text) return ''
  const stripped = text.replace(/<[^>]*>/g, '')
  return stripped.length > len ? stripped.slice(0, len) + '...' : stripped
}

onMounted(() => {
  fetchArticles()
  interval = setInterval(fetchArticles, 5000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

