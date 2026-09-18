<script setup>
  import { ref, onMounted, watch } from "vue";
  import { app, getTheme, setTheme } from "@/api";

  import BottomNavigation from "@/components/BottomNavigation.vue";
  import Loading from "@/components/ui/Loading.vue";

  import StoreScreen from "@/components/screens/StoreScreen.vue";
  import InstallScreen from "@/components/screens/InstallScreen.vue";
  import ManagerScreen from "@/components/screens/ManagerScreen.vue";

  // Init loading
  const loading = ref(true);
  const theme = ref("light");

  // Active Screen [ home / install / apps ]
  const currentScreen = ref("install");
  const invokeAppUri = ref(null);

  // Chane active screen
  function changeScreen(name) {
    currentScreen.value = name;
  }

  // Init
  async function init() {
    const { query, share } = app.info.options;

    const isValidShare =
      share?.itemType === "file" ||
      (share?.itemType === "link" &&
        share.item.startsWith("https://github.com"));

    const uri = isValidShare ? share.item : query?.uri;

    if (typeof uri === "string") {
      invokeAppUri.value = uri;
    }

    theme.value = await getTheme();
    loading.value = false;
  }

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }

  watch(theme, (newTheme, _) => {
    setTheme(newTheme);
  });

  onMounted(() => {
    app.run(init);
  });
</script>

<template>
  <div
    v-if="!loading"
    :data-theme="theme"
    class="h-dvh flex flex-col overflow-hidden transition-colors bg-base-100"
  >
    <!-- Title -->
    <div
      class="py-3 flex gap-1 items-center justify-between px-2 bg-base-100 text-base-content shadow font-bold text-lg"
    >
      <div class="flex items-center gap-1">
        <img src="@/assets/icon.png" class="w-6 aspect-square" />
        <h1>AppStore</h1>
      </div>

      <button @click="toggleTheme">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g fill="none">
            <path
              fill="currentColor"
              d="M2.75 12A9.25 9.25 0 0 0 12 21.25V2.75A9.25 9.25 0 0 0 2.75 12"
            />
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 21.25a9.25 9.25 0 0 0 0-18.5m0 18.5a9.25 9.25 0 0 1 0-18.5m0 18.5V2.75"
            />
          </g>
        </svg>
      </button>
    </div>

    <Loading v-if="loading" />
    <!-- Screens -->
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <StoreScreen
        v-if="currentScreen === 'home'"
        @changeScreen="changeScreen"
      />
      <InstallScreen
        v-if="currentScreen === 'install'"
        :invokeAppUri="invokeAppUri"
        @clear-uri="invokeAppUri = null"
        @close="() => changeScreen('apps')"
      />
      <ManagerScreen v-if="currentScreen === 'apps'" />
    </div>
    <!-- Bottom Navigation -->
    <BottomNavigation
      :currentScreen="currentScreen"
      @changeScreen="changeScreen"
    />
  </div>
</template>

<style scoped></style>
