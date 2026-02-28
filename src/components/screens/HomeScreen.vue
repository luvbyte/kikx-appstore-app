<template>
  <div class="fscreen flex flex-col gap-2 py-2">
    <!-- Mobile Container -->
    <div class="w-full bg-base-100">
      <!-- App List Section -->

      <div class="p-2">
        <input
          v-model="search"
          class="input input-sm rounded-lg w-full focus:outline-none"
          placeholder="Search..."
        />
      </div>

      <div class="p-2 flex flex-col gap-2 overflow-y-auto">
        <AppCardSmall
          v-for="app in filteredApps"
          :key="app.name"
          :app
          :icon="getIconUrl(app)"
          :isUrl="true"
          @click="selectApp(app)"
        />
      </div>
    </div>

    <InstallerPanel
      v-if="showInstaller && assetData"
      :kikxApp
      :assetData
      :close="closeInstaller"
    />
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount } from "vue";
  import AppCardSmall from "@/components/AppCardSmall.vue";
  import AppManagePanel from "@/components/panels/AppManagePanel.vue";

  import InstallerPanel from "@/components/panels/InstallerPanel.vue";
  const { kikxApp, changeScreen } = defineProps(["kikxApp", "changeScreen"]);

  const selectedApp = ref(null);
  const assetData = computed(
    () =>
      selectedApp.value?.url && `https://github.com/${selectedApp.value.url}`
  );

  const appsIndex = ref([]);
  const search = ref("");

  const showInstaller = ref(false);
  const loading = ref(true);

  function selectApp(app) {
    selectedApp.value = app;
    showInstaller.value = true;
  }

  async function closeInstaller(success = false) {
    showInstaller.value = false;
    selectedApp.value = null;

    if (success) {
      changeScreen("apps");
    }
  }

  const filteredApps = computed(() => {
    if (!search.value) return appsIndex.value?.apps;

    const query = search.value.toLowerCase().trim();

    return appsIndex.value?.apps.filter(app =>
      [app.title, app.name, app.category, app.author].some(field =>
        field?.toString().toLowerCase().includes(query)
      )
    );
  });

  const REPO_BASE_URL =
    "https://raw.githubusercontent.com/luvbyte/kikx-apps-index/main/";

  function getIconUrl(app) {
    if (app.icon.startsWith("http")) return app.icon;
    return "https://raw.githubusercontent.com/luvbyte/kikx-apps-index/refs/heads/main/icons/" + app.icon;
  }

  async function fetchIndex() {
    const response = await fetch(REPO_BASE_URL + "index.json");

    if (!response.ok) {
      throw new Error("Failed to fetch index.json");
    }

    loading.value = false;

    return await response.json();
  }

  onBeforeMount(async () => {
    appsIndex.value = await fetchIndex();
  });
</script>
