<template>
  <div class="flex-1 flex flex-col gap-2 py-2 overflow-y-auto">
    <div class="flex-1 flex flex-col bg-base-100 overflow-hidden">
      <!-- Filters -->
      <div class="p-2 space-y-2">
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 p-1 rounded-xl bg-base-200">
          <button
            class="flex-1 btn btn-sm border-0 rounded-lg"
            :class="
              filterMode === 'all' ? 'btn-primary shadow-sm' : 'btn-ghost'
            "
            @click="setFilter('all')"
          >
            All
          </button>

          <button
            class="flex-1 btn btn-sm border-0 rounded-lg"
            :class="
              filterMode === 'installed' ? 'btn-primary shadow-sm' : 'btn-ghost'
            "
            @click="setFilter('installed')"
          >
            Installed
          </button>

          <button
            class="flex-1 btn btn-sm border-0 rounded-lg"
            :class="
              filterMode === 'available' ? 'btn-primary shadow-sm' : 'btn-ghost'
            "
            @click="setFilter('available')"
          >
            Available
          </button>
        </div>

        <!-- Search -->
        <input
          v-model="search"
          class="input input-sm rounded-lg w-full focus:outline-none"
          placeholder="Search..."
        />
      </div>

      <!-- App List -->
      <div
        ref="scrollContainer"
        class="flex-1 p-2 flex flex-col gap-2 overflow-y-auto scroll-smooth"
      >
        <AppCardSmall
          v-for="appItem in visibleApps"
          :key="appItem.name"
          :app="appItem"
          :icon="getIconUrl(appItem.icon)"
          :isUrl="true"
          @click="selectApp(appItem)"
        />

        <!-- Loading More -->
        <div v-if="loadingMore" class="flex justify-center py-4">
          <span class="loading loading-spinner loading-sm"></span>
        </div>

        <!-- Scroll Sentinel -->
        <div v-if="hasMoreApps" ref="loadMoreTrigger" class="h-4 shrink-0" />

        <!-- Empty -->
        <div
          v-if="!loading && !filteredApps.length"
          class="flex-1 flex items-center justify-center text-sm text-base-content/40"
        >
          No apps found
        </div>
      </div>
    </div>

    <!-- Installer -->
    <Transition name="fade-scale">
      <InstallerPanel
        v-if="showInstaller && assetData"
        :assetData="assetData"
        @close="closeInstaller"
      />
    </Transition>
  </div>
</template>

<script setup>
  import {
    ref,
    computed,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    watch,
    nextTick
  } from "vue";

  import { REPO_BASE_URL, getIconUrl } from "@/api/config";
  import { app } from "@/api";

  import AppCardSmall from "@/components/AppCardSmall.vue";
  import InstallerPanel from "@/components/panels/InstallerPanel.vue";

  const emit = defineEmits(["changeScreen"]);

  // ----------------------------------------
  // State
  // ----------------------------------------

  const search = ref("");
  const filterMode = ref("all");

  const appsIndex = ref([]);
  const installedApps = ref([]);

  const selectedApp = ref(null);

  const loading = ref(true);
  const loadingMore = ref(false);
  const showInstaller = ref(false);

  const scrollContainer = ref(null);
  const loadMoreTrigger = ref(null);

  // ----------------------------------------
  // Pagination
  // ----------------------------------------

  const PAGE_SIZE = 10;

  const visibleCount = ref(PAGE_SIZE);

  // ----------------------------------------
  // Installer
  // ----------------------------------------

  const assetData = computed(() => {
    if (!selectedApp.value?.url) {
      return null;
    }

    return `https://github.com/${selectedApp.value.url}`;
  });

  function selectApp(appItem) {
    selectedApp.value = appItem;
    showInstaller.value = true;
  }

  async function closeInstaller(success = false) {
    showInstaller.value = false;
    selectedApp.value = null;

    if (success) {
      await fetchAppsList();
      emit("changeScreen", "apps");
    }
  }

  // ----------------------------------------
  // Filtering
  // ----------------------------------------

  const filteredApps = computed(() => {
    let apps = appsIndex.value?.apps || [];

    const installedNames = new Set(
      installedApps.value.map(appItem => appItem.name)
    );

    // Installed
    if (filterMode.value === "installed") {
      apps = apps.filter(appItem => installedNames.has(appItem.name));
    }

    // Available
    if (filterMode.value === "available") {
      apps = apps.filter(appItem => !installedNames.has(appItem.name));
    }

    // Search
    const query = search.value.toLowerCase().trim();

    if (query) {
      apps = apps.filter(appItem =>
        [appItem.title, appItem.name, appItem.category, appItem.author].some(
          field => field?.toString().toLowerCase().includes(query)
        )
      );
    }

    return apps;
  });

  // ----------------------------------------
  // Visible Apps
  // ----------------------------------------

  const visibleApps = computed(() => {
    return filteredApps.value.slice(0, visibleCount.value);
  });

  const hasMoreApps = computed(() => {
    return visibleCount.value < filteredApps.value.length;
  });

  // ----------------------------------------
  // Load More
  // ----------------------------------------

  async function loadMore() {
    if (loadingMore.value || !hasMoreApps.value) {
      return;
    }

    loadingMore.value = true;

    // Let the UI render the loading state
    await nextTick();

    visibleCount.value += PAGE_SIZE;

    await nextTick();

    loadingMore.value = false;
  }

  // ----------------------------------------
  // Filter Change
  // ----------------------------------------

  async function setFilter(mode) {
    if (filterMode.value === mode) {
      return;
    }

    filterMode.value = mode;

    // Start from first page
    visibleCount.value = PAGE_SIZE;

    // Reset scroll position
    await nextTick();

    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  }

  // ----------------------------------------
  // Search
  // ----------------------------------------

  watch(search, async () => {
    visibleCount.value = PAGE_SIZE;

    await nextTick();

    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  });

  // ----------------------------------------
  // Intersection Observer
  // ----------------------------------------

  let observer = null;

  function setupObserver() {
    if (!loadMoreTrigger.value) {
      return;
    }

    observer?.disconnect();

    observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        root: scrollContainer.value,
        rootMargin: "200px",
        threshold: 0
      }
    );

    observer.observe(loadMoreTrigger.value);
  }

  watch(
    [loadMoreTrigger, hasMoreApps],
    async () => {
      await nextTick();

      if (hasMoreApps.value) {
        setupObserver();
      } else {
        observer?.disconnect();
      }
    },
    { flush: "post" }
  );

  // ----------------------------------------
  // Fetch Installed Apps
  // ----------------------------------------

  async function fetchAppsList() {
    const { data, error } = await app.system.getAppsList(true);

    if (error) {
      throw new Error(error.detail || error.message);
    }

    installedApps.value = data || [];
  }

  // ----------------------------------------
  // Fetch Repository Index
  // ----------------------------------------

  async function fetchIndex() {
    const response = await fetch(REPO_BASE_URL + "index.json");

    if (!response.ok) {
      throw new Error("Failed to fetch index.json");
    }

    return await response.json();
  }

  // ----------------------------------------
  // Initial Load
  // ----------------------------------------

  onBeforeMount(async () => {
    try {
      loading.value = true;

      const [index] = await Promise.all([fetchIndex(), fetchAppsList()]);

      appsIndex.value = index;
    } catch (error) {
      console.error("Failed to load apps:", error);
    } finally {
      loading.value = false;
    }
  });

  // ----------------------------------------
  // Mounted
  // ----------------------------------------

  onMounted(() => {
    nextTick(() => {
      setupObserver();
    });
  });

  // ----------------------------------------
  // Cleanup
  // ----------------------------------------

  onBeforeUnmount(() => {
    observer?.disconnect();
  });
</script>
