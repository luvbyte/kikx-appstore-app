import { createApp } from "kikx-sdk";
import { DEV, apiUrl } from "@/api/config";

import { KVService, Kpm, Invoker } from "kikx-sdk";

const app = createApp();
const kv = new KVService(app);
const kpm = new Kpm(app);
const invoker = new Invoker(app);

// If its dev mode
if (DEV) {
  app.config.configureUrls({
    apiUrl,
    appID: "cf420507354647ce997f9ba15099a3b3"
  });
}

function invokeTheme(theme) {
  return invoker.setTheme(theme);
}

export async function setTheme(theme) {
  invokeTheme(theme);
  kv.set("data-theme", theme);
}

export async function getTheme() {
  const theme = await kv.getOrSet("data-theme", "light");
  invokeTheme(theme);

  return theme;
}

export { app, kv, kpm };
