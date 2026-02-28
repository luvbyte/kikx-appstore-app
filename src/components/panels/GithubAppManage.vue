<template>
  <div class="bg-base-100 fixed fullscreen inset-0 z-60 flex flex-col gap-2">
    <Header title="Github Installer" :close />

    <Loading v-if="!app" class="fscreen" label="Fetching" />

    <AppManifest v-else :manifest="app.manifest" :uninstallApp />

    <div v-if="app" class="p-2 py-4">
      <div v-if="errorText" class="flex items-center justify-center p-2">
        <h1 class="font-semibold text-error">
          {{ errorText }}
        </h1>
      </div>
      <SlideButton v-else @complete="installApp" :label="buttonLabel" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount, onBeforeUnmount } from "vue";
  import AppManifest from "@/components/AppManifest.vue";
  import SlideButton from "@/components/SlideButton.vue";

  import Header from "@/components/ui/Header.vue";
  import Loading from "@/components/ui/Loading.vue";

  import { AppInstaller } from "@/api/Kpm";

  const { url, kikxApp, close } = defineProps(["url", "close", "kikxApp"]);

  const installer = new AppInstaller(kikxApp);

  const loading = ref(true);
  const errorText = ref(null);

  const app = ref(null);

  const buttonLabel = computed(() => {
      if (!app.value) return "";

    if (app.value.is_update) {
      // if its an update
      const { current_version, latest_version } = app.value.is_update;
      return `Slide to update ${current_version} -> ${latest_version}`;
    }

    return "Slide to install";
  });

  // uninstallApp
  async function installApp() {}

  onBeforeMount(async () => {
    try {
      app.value = await installer.prepare_github(url);

      if (!app.value) {
        errorText.value = "Unknown Error";
      }

      // If miss match cant install
      if (!app.value.is_compatible) {
        errorText.value = "App not compatible";
      }

      // If miss match cant install
      if (app.value.app_installed && app.value.source === "local") {
        errorText.value = "Local version found, source missmatch";
      }
    } catch (err) {
      errorText.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  // cancel on unmount
  onBeforeUnmount(() => {
    if (app.value) {
      installer.cancel();
    }
  });
</script>
