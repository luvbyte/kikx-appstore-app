<template>
  <div class="flex-1 flex flex-col gap-2 overflow-y-auto">
    <!-- Selected App -->
    <Transition name="fade-scale">
      <AppManagePanel
        v-if="selectedApp"
        :appName="selectedApp.name"
        @close="reloadApps"
      />
    </Transition>
    <!-- Container -->
    <div class="flex-1 flex flex-col w-full bg-base-100 overflow-hidden">
      <!-- App List Section -->
      <div class="px-2">
        <input
          v-model="search"
          class="input input-sm rounded-lg w-full focus:outline-none"
          placeholder="Search..."
        />
      </div>

      <div class="flex-1 p-2 flex flex-col gap-2 overflow-y-auto scroll-smooth">
        <AppCardSmall
          v-for="app in filteredApps"
          :key="app.name"
          :app="app"
          @click="() => selectApp(app)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount } from "vue";

  import AppCardSmall from "@/components/AppCardSmall.vue";
  import AppManagePanel from "@/components/panels/AppManagePanel.vue";

  import { app } from "@/api";

  const selectedApp = ref(null);
  const apps = ref([]);

  const search = ref("");

  const filteredApps = computed(() => {
    if (!search.value) return apps.value;

    const query = search.value.toLowerCase().trim();

    return apps.value.filter(a =>
      [a.title, a.name, a.category, a.author].some(field =>
        field?.toString().toLowerCase().includes(query)
      )
    );
  });

  function reloadApps() {
    fetchAppsList();
    selectedApp.value = null;
  }

  function selectApp(app) {
    selectedApp.value = app;
  }

  async function fetchAppsList() {
    const { data, error } = await app.system.getAppsList(true);

    if (error) {
      throw new Error(error.detail);
    }

    apps.value = data;
  }

  onBeforeMount(fetchAppsList);
</script>
