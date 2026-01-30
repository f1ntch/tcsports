<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Dashboard</h1>
          <v-btn color="error" variant="outlined" @click="handleSignOut">
            Sign Out
          </v-btn>
        </div>
        <v-card>
          <v-card-text>
            <p>Welcome, {{ auth.user?.email }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleSignOut() {
  await auth.signOut()
  router.push('/')
}
</script>

