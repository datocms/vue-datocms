import { createApp } from "vue";
import { createMetaManager } from "vue-meta";
import App from "./App.vue";

const app = createApp(App)
  .use(createMetaManager())

app.mount("#app");
