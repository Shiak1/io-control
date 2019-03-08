import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Users from './components/Users.vue';
import Devices from './components/Devices.vue';

Vue.use(VueRouter);

export default new VueRouter({
	mode: 'history',
	routes: [
		{ path: '/home', component: Home },
		{ path: '/login', component: Login },
		{ path: '/users', component: Users },
		{ path: '/devices', component: Devices },
	],
});
