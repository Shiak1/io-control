<template>
    <div id="app">
        <b-container v-if="loggedIn()">
            <b-row class="mt-3">
                <b-col sm="auto"></b-col>
                <b-col>
                    <div>
                        <b-nav tabs class="float-left" v-if="views.length > 1">
                            <b-nav-item
                                active-class="active"
                                v-for="view in views"
                                v-bind:to="view.route"
                            >
                                <svg viewBox="0 0 8 8" class="icon">
                                    <use
                                        v-bind:xlink:href="
                                            `/assets/svg/open-iconic.svg#${view.icon}`
                                        "
                                    ></use>
                                </svg>
                            </b-nav-item>
                        </b-nav>
                        <b-button class="float-right" variant="outline-info" @click="logout()"
                            ><svg viewBox="0 0 8 8" class="clickable icon">
                                <use
                                    xlink:href="/assets/svg/open-iconic.svg#account-logout"
                                ></use></svg
                        ></b-button>
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
