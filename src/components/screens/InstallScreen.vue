<template>
  <div class="fscreen bg-base-100 flex flex-col">
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

      <!-- Upload App -->
      <div class="w-full max-w-lg mx-auto">
        <div class="mb-6 text-center">
          <h1 class="text-xl font-bold">Upload App</h1>
          <p class="text-sm text-base-content/60 mt-1">
            Choose where you want to load your .kikx app from
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- App File -->
          <div
            class="group relative rounded-2xl border border-base-300 bg-base-100 p-5 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer"
            @click="fileInput?.click()"
          >
            <input
              ref="fileInput"
              type="file"
              :disabled="processing"
              class="hidden"
              @change="handleFileUpload"
            />

            <div
              class="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V3m0 0l-3 3m3-3l3 3"
                />
              </svg>
            </div>

            <h2 class="font-semibold">Upload App File</h2>

            <p class="text-xs text-base-content/60 mt-1">
              Upload .kikx file from your device
            </p>

            <div
              v-if="selectedFile"
              class="mt-4 flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>

              <span class="text-xs font-medium truncate">
                {{ selectedFile.name }}
              </span>
            </div>

            <div
              class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <!-- Local File -->
          <div
            class="group relative rounded-2xl border border-base-300 bg-base-100 p-5 hover:border-secondary/60 hover:bg-secondary/5 active:scale-[0.98] transition-all cursor-pointer"
            @click="localFileUpload"
          >
            <div
              class="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
              </svg>
            </div>

            <h2 class="font-semibold">Local Storage</h2>

            <p class="text-xs text-base-content/60 mt-1">
              Choose an app from your local file system
            </p>

            <div
              class="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-secondary"
            >
              Browse files

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  import { ref, computed, onBeforeMount } from "vue";
  import { invoker } from "@/api";

  import InstallerPanel from "@/components/panels/InstallerPanel.vue";

  const props = defineProps({
    invokeAppUri: {
      type: String,
      required: false
    }
  });
  const emit = defineEmits(["close", "clear-uri"]);

  const fileInput = ref(null);
  const selectedFile = ref(null);
  const showInstaller = ref(false);
  const processing = ref(false);

  const githubUrl = ref("");

  const assetData = computed(
    () => selectedFile.value || githubUrl.value || null
  );

  function handleGithubInstall() {
    if (!githubUrl.value) return;
    processing.value = true;
    showInstaller.value = true;
  }

  function handleStorageInstall(uri) {
    processing.value = true;
    // checks
    selectedFile.value = uri;
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

    if (props.invokeAppUri) {
      emit("clear-uri");
    }

    if (success) {
      emit("close");
    }
  }

  async function handleInvokeUri() {
    const uri = props.invokeAppUri;

    if (!uri) return;

    if (uri.startsWith("https://github.com")) {
      githubUrl.value = uri;
      handleGithubInstall();
    } else {
      handleStorageInstall(uri);
    }
  }

  async function localFileUpload() {
    const file = await invoker.askFile({
      title: "Select kikx file",
      accept: "kikx"
    });

    if (!file) {
      return;
    }

    handleStorageInstall(file.kikxpath);
  }

  onBeforeMount(() => {
    if (!props.invokeAppUri) return;

    handleInvokeUri();
  });
</script>
