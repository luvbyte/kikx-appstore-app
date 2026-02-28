<template>
  <div class="fixed inset-0 z-30 fscreen flex flex-col">
    <!--<input type="file" @change="handleFileUpload" />-->
    <!--<button class="btn btn-md" @click="uploadFile">Upload</button>-->
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import axios from "axios";

  import { KikxApp, AppInstaller, AppUninstaller } from "kikx-sdk";

  const app = new KikxApp();
  const installer = new AppUninstaller(app);

  const selectedFile = ref(null);

  const handleFileUpload = event => {
    selectedFile.value = event.target.files[0];
  };

  const uploadFile = async () => {
    if (!selectedFile.value) {
      return;
    }
  };
</script>
