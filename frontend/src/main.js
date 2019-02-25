import Vue from 'vue';
import VueResource from 'vue-resource';
import BootstrapVue from 'bootstrap-vue';

import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueResource);

new Vue({
	router,
	render: h => h(App),
}).$mount('#app');
