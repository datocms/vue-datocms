import Vue from "vue";
import { DatocmsImagePlugin } from "vue-datocms";
import VueMeta from "vue-meta";

import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(VueMeta);
Vue.use(DatocmsImagePlugin);

new Vue({
  render: h => h(App)
}).$mount("#app");
