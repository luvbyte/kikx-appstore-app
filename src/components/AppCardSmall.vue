<template>
  <div
    class="group flex items-center gap-3 rounded-xl border border-base-200 bg-base-100 p-3 transition-all duration-200 hover:border-base-300 hover:bg-base-50 hover:shadow-sm"
  >
    <!-- App Icon -->
    <div
      class="size-14 shrink-0 overflow-hidden rounded-xl border border-base-200 bg-base-200/50 p-0.5"
    >
      <img
        class="size-full rounded-[10px] object-cover transition-opacity duration-300"
        :class="loaded ? 'opacity-100' : 'opacity-0'"
        :src="icon || getUrl(app.icon)"
        :alt="`${app.title} icon`"
        @load="loaded = true"
        @error="loaded = true"
      />
    </div>

    <!-- App Info -->
    <div class="min-w-0 flex-1">
      <!-- Title -->
      <div class="flex items-center gap-2">
        <h3 class="truncate text-lg font-semibold font-heading">
          {{ app.title }}
        </h3>
      </div>

      <!-- Package Name -->
      <p v-if="app.name" class="mt-0.5 truncate text-sm text-base-content/40">
        {{ app.name }}
      </p>

      <!-- Metadata -->
      <div
        v-if="app.author || app.version || app.services?.length"
        class="mt-1.5 flex min-w-0 items-center gap-2"
      >
        <span v-if="app.author" class="truncate text-xs text-base-content/55">
          {{ app.author }}
        </span>

        <span
          v-if="app.author && app.version"
          class="text-[10px] text-base-content/25"
        >
          •
        </span>

        <span
          v-if="app.version"
          class="shrink-0 text-[10px] text-base-content/45"
        >
          v{{ app.version }}
        </span>

        <span
          v-if="app.services?.length"
          class="badge badge-xs badge-ghost ml-auto shrink-0"
        >
          {{ app.services.length }}
          {{ app.services.length === 1 ? "service" : "services" }}
        </span>
      </div>
    </div>

    <!-- Chevron -->
    <div
      class="shrink-0 text-base-content/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-base-content/50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-4"
      >
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 0 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.06.02Z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { getUrl } from "@/api/config";

  const loaded = ref(false);

  defineProps({
    app: {
      type: Object,
      required: true
    },
    icon: {
      type: String,
      required: false
    }
  });
</script>
