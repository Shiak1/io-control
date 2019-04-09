<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table outlined fixed :items="users" :fields="fields">
                    <template v-slot:role="{ item, value }">
                        {{ value }}

                        <div class="float-right clickable">
                            <icon icon="pencil" title="Edit" :onClick="() => edit(item)"></icon>
                        </div>
                    </template>
                </b-table>
            </b-col>
            <b-col sm="auto"></b-col>
        </b-row>

        <b-row>
            <b-col></b-col>
            <b-col cols="6"
                ><b-button class="icon-container" variant="outline-primary" block @click="create">
                    <icon icon="plus"></icon></b-button
            ></b-col>
            <b-col></b-col>
        </b-row>

        <user-modal
            ref="modal"
            v-on:created="created"
            v-on:updated="updated"
            v-on:removed="removed"
        ></user-modal>
    </b-container>
</template>

<script>
import http from '../services/http';

import User from './User';

export default {
    data() {
        return {
            fields: [
                {
                    key: 'fullName',
                    sortable: true,
                    label: 'Name',
                },
                {
                    key: 'username',
                    sortable: true,
                    lable: 'Username',
                },
                {
                    key: 'role',
                    sortable: false,
                },
            ],
            users: [],
        };
    },

    methods: {
        async load() {
            const { data } = await http.get('/api/user');

            this.users = data;
        },

        create() {
            this.$refs.modal.open();
        },
        edit(user) {
            this.$refs.modal.open(user);
        },
        created(user) {
            this.users.push(user);
        },
        updated() {
            this.load();
        },
        removed(id) {
            this.users = this.users.filter(user => user.id != id);
        },
    },

    components: {
        'user-modal': User,
    },

    async created() {
        await this.load();
    },
};
</script>
