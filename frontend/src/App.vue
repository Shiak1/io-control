<template>
    <div id="app">
        <b-container v-if="loggedIn()">
            <b-row class="mt-3">
                <b-col sm="auto"></b-col>
                <b-col>
                    <div>
                        <b-nav tabs class="float-left" v-if="views.length > 1">
                            <b-nav-item
                                class="icon-container"
                                active-class="active"
                                v-for="view in views"
                                :to="view.route"
                                :key="`vue-routes:${view.route}`"
                            >
                                <icon :viewBox="view.viewBox" :icon="view.icon"></icon>
                            </b-nav-item>
                        </b-nav>
                        <b-button
                            class="icon-container float-right clickable"
                            variant="outline-info"
                            @click="logout()"
                        >
                            <icon icon="account-logout"></icon>
                        </b-button>
                    </div>
                </b-col>
                <b-col sm="auto"></b-col>
            </b-row>
        </b-container>
        <router-view />
    </div>
</template>

<script>
import http from './services/http';

const iconMap = {
    users: {order: 2, icon:'person'},
    devices: { order: 1, icon: 'terminal' },
    logs: { order: 3, icon: 'history', viewBox: '0 0 14 16' },
};

export default {
    data: () => ({ views: [] }),
    computed: {
        current: () => document.location.pathname.slice(1),
    },
    methods: {
        loggedIn() {
            return document.location.pathname != '/login';
        },
        async logout() {
            await http.post('/logout');
        },
        async loadViews() {
            if (!this.loggedIn()) return;

            this.views = (await http.get('/api/views')).data.map(view => ({
                route: '/' + view,
                icon: iconMap[view].icon,
                viewBox: iconMap[view].viewBox,
                order: iconMap[view].order
            })).sort(({order: a}, {order: b}) => a - b);
        },
    },
    created() {
        this.loadViews();
    },
};
</script>
