<template>
  <div class="relative flex-1 flex flex-col overflow-hidden">
    <div
      @click="displayJson = !displayJson"
      class="absolute w-12 top-2 right-2 btn btn-xs btn-info"
    >
      {{ displayJson ? "UI" : "Json" }}
    </div>
    <!-- Hero Section -->
    <div>
      <div class="p-2 flex gap-2 items-start">
        <!-- Icon -->
        <div class="w-24 h-24 flex items-center justify-center">
          <img
            class="w-20 h-20 rounded-lg"
            :src="iconUrl || getAppIcon(manifest.icon, manifest.name)"
          />
        </div>

        <!-- App Info -->
        <div class="flex-1 pt-2">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ manifest.title }}
          </h1>

          <div class="font-medium">
            {{ manifest.author }}
          </div>

          <p class="text-xs opacity-50 mt-1">
            {{ manifest.name }}
          </p>
        </div>
      </div>

      <!-- Key Info Grid -->
      <div
        class="shadow-lg grid grid-cols-3 gap-4 text-center bg-primary p-2 text-primary-content"
      >
        <div>
          <p class="text-lg font-semibold truncate">
            {{ manifest.version }}
          </p>
          <p class="text-xs opacity-50">Version</p>
        </div>

        <div>
          <p class="text-lg font-semibold truncate">
            {{ manifest.category || manifest.theme }}
          </p>
          <p class="text-xs opacity-50">
            {{ manifest.category ? "Category" : "Theme" }}
          </p>
        </div>

        <div>
          <p class="text-lg font-semibold truncate">
            {{ manifest.author ?? "Unknown" }}
          </p>
          <p class="text-xs opacity-50">Author</p>
        </div>
      </div>

      <!-- Sudo -->

      <div
        v-if="manifest.sudo"
        class="my-2 p-2 bg-error text-error-content opacity-80"
      >
        This app uses sudo privileges and can access system and root files. Use
        with caution.
      </div>
    </div>
    <!-- Json -->

    <pre v-if="displayJson" class="text-sm overflow-auto">{{ manifest }}</pre>
    <!-- Information Section -->
    <div v-else class="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
      <!-- About -->
      <p
        v-if="manifest.description"
        class="text-sm leading-relaxed opacity-80 text-center line-clamp-6"
      >
        {{ manifest.description }}
      </p>

      <!-- Storage access -->
      <div>
        <div class="divider m-0">Storage</div>
        <div class="mt-1 flex gap-2 flex-wrap">
          <div
            v-for="(value, name) in manifest.storage"
            class="badge badge-sm"
            :class="getStorageBadge(value)"
          >
            {{ name }} {{ value ?? "" }}
          </div>
        </div>
      </div>
      <!-- Access -->
      <div v-if="accessList.length">
        <div class="divider m-0">Access</div>
        <div class="mt-2 flex gap-2 flex-wrap">
          <div v-for="name in accessList" class="badge badge-sm badge-primary">
            {{ name }}
          </div>
        </div>
      </div>
      <!-- Iframe -->
      <div v-if="iframeList.length">
        <div class="divider m-0">Iframe</div>
        <div class="mt-2 flex gap-2 flex-wrap">
          <div v-for="name in iframeList" class="badge badge-sm badge-primary">
            {{ name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { getAppIcon } from "@/api/config";

  const { manifest, iconUrl } = defineProps(["manifest", "iconUrl"]);

  const displayJson = ref(false);

  const getStorageBadge = value => {
    if (value === "*") return "badge-error";
    if (value === "write") return "badge-secondary";
    if (value === "read") return "badge-info";
    return "badge-primary opacity-30";
  };

  const accessList = [
    ...(manifest?.proxy ? ["proxy"] : []),
    ...(manifest?.system?.access ?? [])
  ];

  const iframeList = [
    ...(manifest?.iframe?.allowfullscreen ? ["allowfullscreen"] : []),
    ...(manifest?.iframe?.sandbox ?? []),
    ...(manifest?.iframe?.allow ?? []),
    ...(manifest?.iframe?.loading ? [manifest.iframe.loading] : []),
    ...(manifest?.iframe?.referrerpolicy
      ? [manifest.iframe.referrerpolicy]
      : [])
  ];
</script>
