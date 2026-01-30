<template>
  <v-container>
    <h1 class="text-h4 mb-6">Test Supabase</h1>
    
    <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
    
    <v-alert type="info" class="mb-4" density="compact">
      Configured: {{ debug.configured }} | URL: {{ debug.url }}
    </v-alert>

    <v-card class="mb-6 pa-4">
      <v-form @submit.prevent="addRow">
        <v-text-field v-model="name" label="Name" required class="mb-4" />
        <v-btn type="submit" color="primary" :loading="loading">Add Row</v-btn>
      </v-form>
    </v-card>

    <v-card>
      <v-card-title>Rows</v-card-title>
      <v-list>
        <v-list-item v-for="row in rows" :key="row.id">
          <v-list-item-title>{{ row.id }} - {{ row.name }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!rows.length">
          <v-list-item-title class="text-medium-emphasis">No rows yet</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const name = ref('')
const rows = ref([])
const loading = ref(false)
const error = ref('')
const debug = ref({
  configured: isSupabaseConfigured,
  url: import.meta.env.VITE_SUPABASE_URL || 'NOT SET'
})

async function fetchRows() {
  if (!isSupabaseConfigured) {
    error.value = 'Supabase not configured'
    return
  }
  const { data, error: err } = await supabase.from('test').select('*').order('id', { ascending: false })
  if (err) {
    error.value = `Fetch error: ${err.message}`
    console.error('Fetch error:', err)
  } else {
    rows.value = data || []
    error.value = ''
  }
}

async function addRow() {
  if (!name.value.trim()) return
  if (!isSupabaseConfigured) {
    error.value = 'Supabase not configured'
    return
  }
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.from('test').insert({ name: name.value })
  if (err) {
    error.value = `Insert error: ${err.message}`
    console.error('Insert error:', err)
  } else {
    name.value = ''
    await fetchRows()
  }
  loading.value = false
}

onMounted(fetchRows)
</script>

