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
                                v-bind:to="'/' + view"
                                >{{ view[0].toUpperCase() + view.slice(1) }}
                            </b-nav-item>
                        </b-nav>
                        <b-button class="float-right" variant="outline-info" @click="logout()"
                            >Logout</b-button
                        >
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

            this.views = (await http.get('/api/views')).data;
        },
    },
    created() {
        this.loadViews();
    },
};
</script>
