import Vue from 'vue'
import { DatocmsImagePlugin } from "vue-datocms";

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(DatocmsImagePlugin);

new Vue({
  render: h => h(App),
}).$mount('#app')
