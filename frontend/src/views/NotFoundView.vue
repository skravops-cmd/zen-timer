<template>
  <div class="flex flex-col items-center justify-center pt-24 text-center">
    <span class="text-6xl font-light opacity-30 mb-4">404</span>
    <h1 class="text-xl font-semibold mb-2">Page not found</h1>
    <p class="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
    <router-link to="/"
      class="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
    >
      Back to Timer
    </router-link>
  </div>
</template>
