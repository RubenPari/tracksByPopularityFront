<template>
  <button
    class="action-button"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <div class="button-content">
      <div class="icon" v-if="!loading">
        <slot name="icon"></slot>
      </div>
      <div class="spinner" v-else></div>
      <div class="text-content">
        <h3 class="title">
          <slot name="title"></slot>
        </h3>
        <p class="description">
          <slot name="description"></slot>
        </p>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  disabled?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.action-button {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.action-button:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-background-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button:active:not(:disabled) {
  transform: translateY(0);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text-content {
  flex: 1;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
}

.description {
  font-size: 0.9rem;
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>
