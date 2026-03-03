<template>
  <div class="flex-1 flex flex-col gap-2 overflow-y-auto">
    <h1 class="p-2 bg-primary/60 text-primary-content font-semibold">
      Manage Apps
    </h1>
    <!-- Selected App -->
    <Transition name="fade-scale">
      <AppManagePanel
        v-if="selectedApp"
        :manifest="selectedApp"
        :kikxApp
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
          :app
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

  const { kikxApp } = defineProps(["kikxApp"]);

  const selectedApp = ref(null);
  const apps = ref([]);

  const search = ref("");

  const filteredApps = computed(() => {
    if (!search.value) return apps.value;

    const query = search.value.toLowerCase().trim();

    return apps.value.filter(app =>
      [app.title, app.name, app.category, app.author].some(field =>
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
    const res = await kikxApp.system.request(`app/installed-apps`);

    if (!res.ok) {
      throw new Error(res.error);
    }

    apps.value = res.data;
  }

  onBeforeMount(async () => {
    await fetchAppsList();
  });
</script>
