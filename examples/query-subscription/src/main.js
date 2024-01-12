import { createApp } from 'vue';
import * as VueMeta from 'vue-meta';
import { DatocmsImagePlugin } from 'vue-datocms';

import App from './App.vue';

createApp(App)
  .use(VueMeta)
  .use(DatocmsImagePlugin)
  .mount('#app');
