<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h2 font-weight-bold mb-4">TC Sports</h1>
        <p class="text-h6 text-medium-emphasis mb-8">Your sports platform</p>
        <v-alert v-if="!isSupabaseConfigured" type="warning" class="mb-6">
          Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
        </v-alert>
        <v-btn v-if="!auth.user" color="primary" size="large" to="/login">
          Get Started
        </v-btn>
        <v-btn v-else color="primary" size="large" to="/dashboard">
          Dashboard
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { isSupabaseConfigured } from '@/lib/supabase'
const auth = useAuthStore()
</script>

