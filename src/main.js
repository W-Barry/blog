import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueNoty from "vuejs-noty"
import 'vuejs-noty/dist/vuejs-noty.css'

import VueDisqus from 'vue-disqus'

import wysiwyg from "vue-wysiwyg";
import "vue-wysiwyg/dist/vueWysiwyg.css";




Vue.use(VueNoty);

Vue.use(VueDisqus);

Vue.use(wysiwyg, {});

Vue.config.productionTip = false

const authdata = localStorage.getItem("auth");

new Vue({
  router,
  data:{
    auth: authdata ? JSON.parse(authdata) : {}
  },
 render: h => h(App),
}).$mount('#app')
