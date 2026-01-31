<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
:root {
  --border-color: rgba(160, 160, 184, 0.15);
}

html {
  overflow-y: auto !important;
}

body {
  font-family: 'Inter', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-application {
  font-family: 'Inter', sans-serif !important;
}

.v-card {
  border-color: var(--border-color) !important;
}

.v-card--variant-outlined {
  border-width: 1px !important;
}

.v-navigation-drawer {
  border-color: var(--border-color) !important;
}

.v-divider {
  border-color: var(--border-color) !important;
  opacity: 1 !important;
}

.v-list-item--active {
  background: rgba(168, 85, 247, 0.1) !important;
}

.v-footer {
  border-color: var(--border-color) !important;
}
</style>
