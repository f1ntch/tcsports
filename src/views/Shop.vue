<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">{{ t.shop.title }}</h1>
          <p class="mt-2 text-muted-foreground">{{ t.shop.subtitle }}</p>
        </div>
        <button
          @click="cartOpen = true"
          class="relative flex items-center gap-2 rounded-lg bg-card px-4 py-2 font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <ShoppingCart class="h-5 w-5" />
          <span class="hidden sm:inline">Cart</span>
          <span
            v-if="cartItemCount > 0"
            class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
          >
            {{ cartItemCount }}
          </span>
        </button>
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

    <!-- Cart Sidebar -->
    <div v-if="cartOpen" class="fixed inset-0 z-50" @click.self="cartOpen = false">
      <div class="absolute inset-0 bg-black/50" @click="cartOpen = false" />
      <aside class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-xl">
        <div class="flex items-center justify-between border-b border-border p-4">
          <h2 class="text-lg font-semibold">Shopping Cart</h2>
          <button @click="cartOpen = false" class="rounded p-1 hover:bg-accent">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div v-if="cart.length === 0" class="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <ShoppingCart class="mb-4 h-16 w-16 text-muted-foreground" />
          <p class="text-muted-foreground">Your cart is empty</p>
        </div>
        
        <div v-else class="flex flex-1 flex-col">
          <div class="flex-1 overflow-auto p-4">
            <div v-for="item in cart" :key="item.id" class="mb-4 flex gap-4 rounded-lg border border-border bg-card p-3">
              <img :src="item.image" class="h-20 w-20 rounded-md bg-gray-100 object-contain p-2" />
              <div class="flex flex-1 flex-col">
                <h4 class="line-clamp-2 text-sm font-medium">{{ item.name }}</h4>
                <p class="mt-1 text-sm font-bold text-primary">€{{ item.price.toFixed(2).replace('.', ',') }}</p>
                <div class="mt-auto flex items-center gap-2">
                  <button @click="updateQuantity(item.id, -1)" class="rounded bg-muted px-2 py-0.5 text-sm hover:bg-muted/80">-</button>
                  <span class="text-sm font-medium">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, 1)" class="rounded bg-muted px-2 py-0.5 text-sm hover:bg-muted/80">+</button>
                  <button @click="removeFromCart(item.id)" class="ml-auto text-xs text-destructive hover:underline">Remove</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border-t border-border p-4">
            <div class="mb-4 flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span class="text-primary">€{{ cartTotal.toFixed(2).replace('.', ',') }}</span>
            </div>
            <button
              @click="openCheckout"
              class="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Checkout with Stripe
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Stripe Checkout Modal -->
    <div v-if="checkoutOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60" @click="checkoutOpen = false" />
      <div class="relative w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <!-- Stripe Header -->
        <div class="flex items-center justify-between border-b p-4">
          <div class="flex items-center gap-2">
            <svg class="h-8 w-8" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#635BFF"/>
              <path d="M19.4 16.2c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1v-4c-1.4-.6-2.9-.9-4.3-.9-3.5 0-5.8 1.8-5.8 4.9 0 4.8 6.6 4 6.6 6.1 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v4c1.7.7 3.3 1 4.9 1 3.6 0 6-1.8 6-4.9 0-5.2-6.6-4.3-6.6-6z" fill="white"/>
            </svg>
            <span class="font-semibold text-gray-900">Stripe Checkout</span>
          </div>
          <button @click="checkoutOpen = false" class="rounded p-1 text-gray-500 hover:bg-gray-100">
            <X class="h-5 w-5" />
          </button>
        </div>
        
        <div v-if="!paymentSuccess" class="p-6">
          <!-- Order Summary -->
          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-gray-500">ORDER SUMMARY</h3>
            <div class="space-y-2">
              <div v-for="item in cart" :key="item.id" class="flex justify-between text-sm text-gray-700">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>€{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="mt-3 flex justify-between border-t pt-3 text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>€{{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment Form -->
          <form @submit.prevent="processPayment" class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input v-model="checkoutForm.email" type="email" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]" placeholder="you@example.com" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Card number</label>
              <input v-model="checkoutForm.cardNumber" type="text" required maxlength="19" class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]" placeholder="1234 1234 1234 1234" @input="formatCardNumber" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Expiry</label>
                <input v-model="checkoutForm.expiry" type="text" required maxlength="5" class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]" placeholder="MM/YY" @input="formatExpiry" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">CVC</label>
                <input v-model="checkoutForm.cvc" type="text" required maxlength="4" class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]" placeholder="123" />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Name on card</label>
              <input v-model="checkoutForm.name" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]" placeholder="John Doe" />
            </div>
            <button
              type="submit"
              :disabled="processing"
              class="w-full rounded-md bg-[#635BFF] py-3 font-semibold text-white transition-colors hover:bg-[#5147e5] disabled:opacity-70"
            >
              <span v-if="processing" class="flex items-center justify-center gap-2">
                <Loader2 class="h-4 w-4 animate-spin" />
                Processing...
              </span>
              <span v-else>Pay €{{ cartTotal.toFixed(2) }}</span>
            </button>
          </form>
          <p class="mt-4 text-center text-xs text-gray-500">
            <Lock class="inline h-3 w-3" /> Secured by Stripe
          </p>
        </div>

        <!-- Success State -->
        <div v-else class="p-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>
          <h3 class="mb-2 text-xl font-semibold text-gray-900">Payment Successful!</h3>
          <p class="mb-6 text-gray-600">Thank you for your order. A confirmation email has been sent to {{ checkoutForm.email }}</p>
          <button @click="closeCheckout" class="rounded-md bg-[#635BFF] px-6 py-2 font-medium text-white hover:bg-[#5147e5]">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ShoppingBag, ShoppingCart, X, Loader2, Lock, CheckCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import AppLayout from '@/components/AppLayout.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const selectedTeam = ref(328)
const selectedCategory = ref('all')
const cartOpen = ref(false)
const checkoutOpen = ref(false)
const processing = ref(false)
const paymentSuccess = ref(false)

const cart = ref([])
const checkoutForm = reactive({
  email: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  name: ''
})

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
  { id: 1, name: 'Royal Antwerp FC Home Shirt 25/26', price: 85.00, image: 'https://shop.royalantwerpfc.be/cdn/shop/files/RAFC_1016_of_1.jpg?v=1762269657&width=750', category: 'clothing', teamId: 328, teamName: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png', badge: 'NEW' },
  { id: 2, name: "Royal Antwerp FC 'RAFC' Badslippers", price: 37.50, image: 'https://shop.royalantwerpfc.be/cdn/shop/files/fra001163-badslipper-rood-logo-rafc-42-4v4.jpg?v=1751634671&width=750', category: 'clothing', teamId: 328, teamName: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png' },
  { id: 3, name: 'Voetbal Bal Wit Rood RAFC met Logo', price: 25.00, image: 'https://shop.royalantwerpfc.be/cdn/shop/files/AntwerpenballRAFC_2v2.jpg?v=1768307756&width=750', category: 'equipment', teamId: 328, teamName: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png' },
  { id: 4, name: 'RAFC Sjaal Rood Wit', price: 18.00, image: 'https://shop.royalantwerpfc.be/cdn/shop/files/ANT00017.jpg?v=1767879479&width=750', category: 'accessories', teamId: 328, teamName: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png' },
  { id: 5, name: 'RAFC Mok COYR', price: 12.00, image: 'https://shop.royalantwerpfc.be/cdn/shop/files/antwerpen-mok-coyr-4v5.jpg?v=1751635699&width=750', category: 'accessories', teamId: 328, teamName: 'Antwerp', teamLogo: 'https://cdn.sportmonks.com/images/soccer/teams/8/328.png' }
])

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const teamMatch = product.teamId === selectedTeam.value
    const categoryMatch = selectedCategory.value === 'all' || product.category === selectedCategory.value
    return teamMatch && categoryMatch
  })
})

const cartItemCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

const handleImageError = (event, product) => {
  event.target.src = product.teamLogo
  event.target.classList.add('p-8', 'opacity-50')
}

const addToCart = (product) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
  toast.success(t.value.shop.addedToCart, { description: product.name })
}

const updateQuantity = (productId, delta) => {
  const item = cart.value.find(i => i.id === productId)
  if (item) {
    item.quantity += delta
    if (item.quantity <= 0) removeFromCart(productId)
  }
}

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(i => i.id !== productId)
}

const openCheckout = () => {
  cartOpen.value = false
  checkoutOpen.value = true
  paymentSuccess.value = false
}

const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  value = value.replace(/(.{4})/g, '$1 ').trim()
  checkoutForm.cardNumber = value
}

const formatExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2)
  checkoutForm.expiry = value
}

const processPayment = async () => {
  processing.value = true
  await new Promise(r => setTimeout(r, 2000))
  processing.value = false
  paymentSuccess.value = true
}

const closeCheckout = () => {
  checkoutOpen.value = false
  cart.value = []
  checkoutForm.email = ''
  checkoutForm.cardNumber = ''
  checkoutForm.expiry = ''
  checkoutForm.cvc = ''
  checkoutForm.name = ''
}
</script>
