<template>
  <div class="bg-base-100 fixed fullscreen inset-0 z-60 flex flex-col gap-2">
    <Header :title="manifest.title" :close="onClose" />

    <AppManifest :manifest :uninstallApp />

    <div v-if="!loading">
      <div
        v-if="errorText"
        class="p-2 py-6 bg-base-200 text-lg flex items-center justify-center"
      >
        <h1 class="font-semibold text-error text-sm">{{ errorText }}</h1>
      </div>
      <div v-else class="p-2 py-4">
        <SlideButton
          @complete="uninstallApp"
          label="Slide to uninstall"
          color="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import AppManifest from "@/components/AppManifest.vue";
  import SlideButton from "@/components/SlideButton.vue";

  import Header from "@/components/ui/Header.vue";

  const { manifest, kikxApp } = defineProps(["manifest", "kikxApp"]);

  const emit = defineEmits(["close"]);

  const loading = ref(false);
  const errorText = ref(null);

  function onClose() {
    emit("close");
  }

  // Todo: add this in kpm.js
  async function uninstallApp() {
    try {
      errorText.value = null;
      loading.value = true;

      const res = await kikxApp.system.request(
        `app/uninstall?app_name=${manifest.name}`,
        "DELETE"
      );

      if (!res.ok) {
        throw new Error(res.error.detail);
      }
      onClose();
    } catch (err) {
      errorText.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  }
</script>
