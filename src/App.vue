<script setup>
  import { ref, onBeforeMount } from "vue";
  import { createApp } from "kikx-sdk";
  import { DEV } from "@/api/config";

  import HomeScreen from "@/components/screens/HomeScreen.vue";
  import InstallScreen from "@/components/screens/InstallScreen.vue";
  import AppsScreen from "@/components/screens/AppsScreen.vue";

  const kikxApp = createApp();
  const loading = ref(true);

  const currentScreen = ref("home");

  function changeScreen(name) {
    currentScreen.value = name;
  }

  onBeforeMount(async () => {
    // Dev
    if (DEV) {
      kikxApp.config.configureUrls({
        apiUrl: "http://localhost:1303",
        wsUrl: "ws://localhost:1303",
        appID: "7bc87ad68b394971bddecf8cfcb4f152"
      });
    }
    //
    kikxApp.run(() => {
      loading.value = false;
    });
  });
</script>

<template>
  <div data-theme="light" class="h-dvh flex flex-col">
    <!-- Title -->
    <div
      class="py-3 flex gap-1 items-center px-2 bg-base-100 text-base-content shadow font-bold text-lg"
    >
      <img src="@/assets/icon.png" class="w-6 aspect-square" />
      <h1>AppStore</h1>
    </div>
    <!-- Screens -->
    <div class="flex-1">
      <HomeScreen v-show="currentScreen === 'home'" :kikxApp :changeScreen />
      <InstallScreen
        v-if="currentScreen === 'install'"
        :kikxApp
        :changeScreen
      />
      <AppsScreen v-if="currentScreen === 'apps'" :kikxApp />
    </div>
    <!-- Statusbar -->
    <!-- Bottom Navigation -->
    <div
      class="fixed bottom-0 left-0 right-0 h-16 bg-base-100 border-t border-base-300 flex justify-around items-center px-2"
    >
      <!-- Home -->
      <button
        @click="changeScreen('home')"
        class="relative flex flex-col items-center justify-center w-full text-xs transition-all duration-300"
      >
        <div
          :class="[
            'flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-300',
            currentScreen === 'home'
              ? 'bg-primary/20 text-primary'
              : 'text-base-content'
          ]"
        >
          <!-- Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
            />
          </svg>

          <span class="text-[11px] mt-0.5">Home</span>
        </div>
      </button>

      <!-- Install -->
      <button
        @click="changeScreen('install')"
        class="relative flex flex-col items-center justify-center w-full text-xs transition-all duration-300"
      >
        <div
          :class="[
            'flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-300',
            currentScreen === 'install'
              ? 'bg-primary/20 text-primary'
              : 'text-base-content'
          ]"
        >
          <!-- Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 48 48"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="4"
            >
              <path
                stroke-linecap="round"
                d="M41.4 11.551L36.333 5H11.667l-5.083 6.551"
              />
              <path
                d="M6 13a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v27a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"
              />
              <path stroke-linecap="round" d="m32 27l-8 8l-8-8m7.992-8v16" />
            </g>
          </svg>

          <span class="text-[11px] mt-0.5">Install</span>
        </div>
      </button>

      <!-- Apps -->
      <button
        @click="changeScreen('apps')"
        class="relative flex flex-col items-center justify-center w-full text-xs transition-all duration-300"
      >
        <div
          :class="[
            'flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-300',
            currentScreen === 'apps'
              ? 'bg-primary/20 text-primary'
              : 'text-base-content'
          ]"
        >
          <!-- Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            >
              <rect width="6.5" height="6.5" x="3.75" y="3.75" rx="2" />
              <path
                d="M15.586 3.818a2 2 0 0 1 2.828 0l1.768 1.768a2 2 0 0 1 0 2.828l-1.768 1.768a2 2 0 0 1-2.828 0l-1.768-1.768a2 2 0 0 1 0-2.828z"
              />
              <rect width="6.5" height="6.5" x="3.75" y="13.75" rx="1.5" />
              <rect width="6.5" height="6.5" x="13.75" y="13.75" rx="2" />
            </g>
          </svg>

          <span class="text-[11px] mt-0.5">Apps</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
