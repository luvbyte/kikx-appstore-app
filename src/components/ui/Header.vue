<template>
  <div
    class="px-2 py-3 bg-primary text-primary-content flex items-center justify-between"
  >
    <h1 class="font-bold text-lg">{{ title }}</h1>
    <button @click="close">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
  defineProps(["title", "close"]);
</script>
