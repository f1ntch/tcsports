<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{{ t.shop.title }}</h1>
        <p class="mt-2 text-muted-foreground">{{ t.shop.subtitle }}</p>
      </div>

      <!-- Team Filter -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <span class="text-sm font-medium text-muted-foreground">{{ t.shop.filterByTeam }}:</span>
        <button
          v-for="team in teams"
          :key="team.id"
          class="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="selectedTeam === team.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/10'"
          @click="selectedTeam = team.id"
        >
          <img :src="team.logo" class="h-5 w-5" />
          {{ team.name }}
        </button>
      </div>

      <!-- Category Filter -->
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category.id"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-primary/10'"
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
        >
          <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <img
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-contain transition-transform group-hover:scale-105"
              @error="handleImageError($event, product)"
            />
            <span
              v-if="product.badge"
              class="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
            >
              {{ product.badge }}
            </span>
          </div>
          <div class="p-4">
            <div class="mb-2 flex items-center gap-2">
              <img :src="product.teamLogo" class="h-4 w-4" />
              <span class="text-xs text-muted-foreground">{{ product.teamName }}</span>
            </div>
            <h3 class="mb-2 line-clamp-2 font-semibold text-card-foreground">{{ product.name }}</h3>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary">€{{ product.price.toFixed(2).replace('.', ',') }}</span>
              <button
                @click="addToCart(product)"
                class="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {{ t.shop.addToCart }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="rounded-lg border border-border bg-card p-12 text-center">
        <ShoppingBag class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 class="mb-2 text-lg font-semibold">{{ t.shop.noProducts }}</h3>
        <p class="text-muted-foreground">{{ t.shop.noProductsDesc }}</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShoppingBag } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const selectedTeam = ref(328) // Antwerp by default
const selectedCategory = ref('all')

const teams = ref([
  { id: 328, name: 'Antwerp', logo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png' }
])

const categories = computed(() => [
  { id: 'all', label: t.value.shop.allProducts },
  { id: 'clothing', label: t.value.shop.clothing },
  { id: 'accessories', label: t.value.shop.accessories },
  { id: 'equipment', label: t.value.shop.equipment }
])

const products = ref([
  {
    id: 1,
    name: 'Royal Antwerp FC Home Shirt 25/26',
    price: 85.00,
    image: 'https://shop.royalantwerpfc.be/cdn/shop/files/RAFC_1016_of_1.jpg?v=1762269657&width=750',
    category: 'clothing',
    teamId: 328,
    teamName: 'Antwerp',
    teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png',
    badge: 'NEW'
  },
  {
    id: 2,
    name: "Royal Antwerp FC 'RAFC' Badslippers",
    price: 37.50,
    image: 'https://shop.royalantwerpfc.be/cdn/shop/files/fra001163-badslipper-rood-logo-rafc-42-4v4.jpg?v=1751634671&width=750',
    category: 'clothing',
    teamId: 328,
    teamName: 'Antwerp',
    teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png'
  },
  {
    id: 3,
    name: 'Voetbal Bal Wit Rood RAFC met Logo',
    price: 25.00,
    image: 'https://shop.royalantwerpfc.be/cdn/shop/files/AntwerpenballRAFC_2v2.jpg?v=1768307756&width=750',
    category: 'equipment',
    teamId: 328,
    teamName: 'Antwerp',
    teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png'
  },
  {
    id: 4,
    name: 'RAFC Sjaal Rood Wit',
    price: 18.00,
    image: 'https://shop.royalantwerpfc.be/cdn/shop/files/ANT00017.jpg?v=1767879479&width=750',
    category: 'accessories',
    teamId: 328,
    teamName: 'Antwerp',
    teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png'
  },
  {
    id: 5,
    name: 'RAFC Mok COYR',
    price: 12.00,
    image: 'https://shop.royalantwerpfc.be/cdn/shop/files/antwerpen-mok-coyr-4v5.jpg?v=1751635699&width=750',
    category: 'accessories',
    teamId: 328,
    teamName: 'Antwerp',
    teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png'
  }
])

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const teamMatch = product.teamId === selectedTeam.value
    const categoryMatch = selectedCategory.value === 'all' || product.category === selectedCategory.value
    return teamMatch && categoryMatch
  })
})

const handleImageError = (event, product) => {
  // Use team logo as fallback
  event.target.src = product.teamLogo
  event.target.classList.add('p-8', 'opacity-50')
}

const addToCart = (product) => {
  toast.success(t.value.shop.addedToCart, {
    description: product.name
  })
}
</script>

