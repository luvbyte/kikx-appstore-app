<template>
  <div class="fscreen bg-base-100 flex flex-col">
    <h1 class="p-2 bg-primary/60 text-primary-content font-semibold">
      Install App
    </h1>

    <div class="w-full p-2">
      <!-- GitHub URL Input -->
      <div class="flex gap-2 pt-2">
        <input
          v-model="githubUrl"
          type="text"
          placeholder="Enter github url"
          class="input input-bordered w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:opacity-60"
        />

        <button
          class="btn btn-outline btn-primary rounded-xl"
          :disabled="!githubUrl || processing"
          @click="handleGithubInstall"
        >
          Fetch
        </button>
      </div>

      <!-- Divider -->
      <div class="divider text-xs">OR</div>

      <!-- File Upload Section -->
      <div class="w-full max-w-md mx-auto">
        <h1 class="text-lg font-semibold mb-4 text-center">Upload App</h1>

        <!-- Upload Card -->
        <div
          class="border-2 border-dashed border-base-300 rounded-xl p-6 text-center hover:border-primary transition cursor-pointer"
          @click="fileInput?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".kikx"
            :disabled="processing"
            class="hidden"
            @change="handleFileUpload"
          />

          <div class="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V3m0 0l-3 3m3-3l3 3"
              />
            </svg>

            <p class="text-sm text-base-content/70">Click to select a file</p>

            <p
              v-if="selectedFile"
              class="text-xs text-primary font-medium mt-2"
            >
              {{ selectedFile.name }}
            </p>
          </div>
        </div>
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
  import { ref, computed } from "vue";

  import InstallerPanel from "@/components/panels/InstallerPanel.vue";
  const { kikxApp, changeScreen } = defineProps(["kikxApp", "changeScreen"]);

  const fileInput = ref(null);
  const selectedFile = ref(null);

  const githubUrl = ref(null);

  const showInstaller = ref(false);

  const processing = ref(false);

  const assetData = computed(
    () => selectedFile.value || githubUrl.value || null
  );

  async function handleGithubInstall() {
    if (!githubUrl.value) return;
    processing.value = true;
    showInstaller.value = true;
  }

  const handleFileUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    processing.value = true;
    // checks
    selectedFile.value = file;
    showInstaller.value = true;
  };

  async function closeInstaller(success = false) {
    processing.value = false;
    showInstaller.value = false;
    selectedFile.value = null;
    githubUrl.value = null;

    if (fileInput.value) {
      fileInput.value.value = null; // reset file input
    }

    if (success) {
      changeScreen("apps");
    }
  }
</script>
