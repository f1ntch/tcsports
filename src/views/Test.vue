<template>
  <v-container>
    <h1 class="text-h4 mb-6">Test Supabase</h1>
    
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
import { supabase } from '@/lib/supabase'

const name = ref('')
const rows = ref([])
const loading = ref(false)

async function fetchRows() {
  const { data } = await supabase.from('test').select('*').order('id', { ascending: false })
  rows.value = data || []
}

async function addRow() {
  if (!name.value.trim()) return
  loading.value = true
  await supabase.from('test').insert({ name: name.value })
  name.value = ''
  await fetchRows()
  loading.value = false
}

onMounted(fetchRows)
</script>

