<template>
  <div
    class="flex items-center gap-4 p-4 bg-base-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-base-300 transition-all duration-200"
  >
    <!-- App Icon -->
    <div class="shrink-0">
      <img
        class="w-14 h-14 rounded-xl object-cover"
        :src="getIconUrl()"
        alt="App icon"
      />
    </div>

    <!-- App Info -->
    <div class="flex-1 flex flex-col min-w-0">
      <h3 class="font-semibold text-base truncate">
        {{ app.title }}
      </h3>

      <p class="text-sm opacity-70 truncate">
        {{ app.name }}
      </p>

      <p v-if="app.author?.length > 0" class="text-xs opacity-50 truncate mt-1">
        By {{ app.author }}
      </p>
    </div>

  </div>
</template>
<script setup>
  import { getAppIcon } from "@/api/config";
  const { app, icon, isUrl } = defineProps(["app", "icon", "isUrl"]);

  const getIconUrl = () => {
    console.log(icon);

    if (isUrl) return icon;
    return getAppIcon(app.icon, app.name);
  };
</script>
