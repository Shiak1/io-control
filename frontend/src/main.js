import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

import router from './router';
import App from './App.vue';

import Icon from './components/Icon';

Vue.config.productionTip = false;

Vue.component('icon', Icon);

Vue.use(BootstrapVue);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
