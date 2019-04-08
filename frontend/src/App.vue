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
                                <icon :icon="view.icon"></icon>
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
    users: 'person',
    devices: 'terminal',
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
                icon: iconMap[view],
            }));
        },
    },
    created() {
        this.loadViews();
    },
};
</script>
