<template>
  <div :class="['callout', typeClass]">
    <div class="flex items-start gap-2">
      <div class="flex-grow">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'info' | 'warning' | 'success'
  }>(),
  {
    type: 'info'
  }
)

const typeClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'callout-warning'
    case 'success':
      return 'callout-success'
    default:
      return 'callout-info'
  }
})
</script>
