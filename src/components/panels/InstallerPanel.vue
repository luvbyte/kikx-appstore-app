<template>
  <div class="bg-base-100 fixed fullscreen inset-0 z-60 flex flex-col gap-2">
    <Header title="App Installer" :close="() => onClose()" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Manifest -->
      <Loading v-if="loading" :label="loadingText" />
      <AppManifest
        v-if="appData"
        :manifest="appData.manifest"
        :iconUrl="getIconUrl(appData.manifest.icon)"
      />
    </div>
    <!-- Error Text -->
    <div
      v-if="errorText"
      class="p-2 py-6 bg-base-200 text-lg flex items-center justify-center"
    >
      <h1 class="font-semibold text-error text-sm">{{ errorText }}</h1>
    </div>
    <!-- Install Button -->
    <div
      v-if="!loading && !errorText && appData"
      class="p-2 py-4 flex flex-col gap-2"
    >
      <SlideButton @complete="completeInstall" :label="sliderLabel" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
  import AppManifest from "@/components/AppManifest.vue";
  import SlideButton from "@/components/SlideButton.vue";

  import Loading from "@/components/ui/Loading.vue";
  import Header from "@/components/ui/Header.vue";

  import { AppInstaller } from "@/api/Kpm";

  const { kikxApp, assetData } = defineProps(["kikxApp", "assetData"]);
  const emit = defineEmits(["close"]);

  // when closing

  const installer = new AppInstaller(kikxApp);

  // Prepare response data
  const appData = ref(null);
  const errorText = ref(null);
  const loading = ref(true);
  // Loading label
  const loadingText = ref("Loading");

  // If its github
  const isGithub = () => typeof assetData === "string";

  // Slider label dynamic
  const sliderLabel = computed(() => {
    if (!appData.value) return "";

    if (appData.value.is_update) {
      const { current_version, latest_version } = appData.value.is_update;
      return `Slide to update (${current_version} -> ${latest_version})`;
    } else {
      return "Slide to install";
    }
  });

  // Getting icon from preview file
  const getIconUrl = icon => {
    if (icon.startsWith("http")) {
      return icon;
    }

    return installer.getPreviewUrl(`public/${icon}`);
  };

  async function completeInstall() {
    try {
      if (appData.value.is_update) {
        loadingText.value = "Updating...";
      } else {
        loadingText.value = "Installing...";
      }
      loading.value = true;

      await installer.install();

      // Close - success
      emit("close", true);
    } catch (err) {
      // Error
      errorText.value = err.message || "Unknon error";
    } finally {
      loading.value = false;
    }
  }

  // close button
  async function onClose(success = false) {
    loadingText.value = "Closing...";
    loading.value = true;

    // Clear cache in server
    if (appData.value) {
      installer.cancel();
    }

    emit("close", success);
  }

  function preCheck() {
    if (!appData.value) throw Error("Unknown error");

    if (!appData.value.is_compatible) {
      throw Error("App is not compatible");
    }

    // If version is less
    if (appData.value.app_installed && !appData.value.is_update) {
      throw Error("App already latest version");
    }
  }

  onBeforeMount(async () => {
    try {
      appData.value = isGithub()
        ? await installer.prepare_github(assetData)
        : await installer.prepare(assetData);

      preCheck();
    } catch (err) {
      errorText.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  });

  // cancel on unmount
  onBeforeUnmount(() => {
    if (appData.value) {
      installer.cancel();
    }
  });
</script>
