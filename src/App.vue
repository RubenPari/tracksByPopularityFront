<script setup lang="ts">
import { RouterView } from 'vue-router'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
</script>

<template>
  <ErrorBoundary>
    <RouterView />
  </ErrorBoundary>
</template>

<style>
:root {
  --color-background: #ffffff;
  --color-background-soft: #f8f9fa;
  --color-background-hover: #f0f1f3;
  --color-background-mute: #f2f3f5;
  --color-border: #e1e4e8;
  --color-border-hover: #d0d7de;
  --color-heading: #24292f;
  --color-text: #24292f;
  --color-text-secondary: #57606a;
  --color-primary: #646cff;
  --color-primary-hover: #535bf2;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0d1117;
    --color-background-soft: #161b22;
    --color-background-hover: #1c2128;
    --color-background-mute: #21262d;
    --color-border: #30363d;
    --color-border-hover: #484f58;
    --color-heading: #f0f6fc;
    --color-text: #c9d1d9;
    --color-text-secondary: #8b949e;
    --color-primary: #646cff;
    --color-primary-hover: #535bf2;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: var(--color-primary-hover);
}
</style>
