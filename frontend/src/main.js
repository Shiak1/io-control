import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
