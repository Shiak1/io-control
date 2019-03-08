<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table bordered :items="users" :fields="fields">
                    <template slot="role" slot-scope="row">
                        {{ row.value }}
                        <span
                            class="oi oi-pencil float-right clickable"
                            title="pencil"
                            aria-hidden="true"
                            @click="edit(row.item)"
                        ></span>
                    </template>
                </b-table>
            </b-col>
            <b-col sm="auto"></b-col>
        </b-row>

        <b-row class="mt-3">
            <b-col></b-col>
            <b-col
                ><b-button variant="outline-primary" block size="lg" @click="create"
                    ><span class="oi oi-plus" title="plus" aria-hidden="true"></span></b-button
            ></b-col>
            <b-col></b-col>
        </b-row>

        <b-modal id="user" :title="modalTitle" @hidden="reset()">
            <b-form-group label="Name">
                <b-form-input v-model="modal.user.fullName" trim />
            </b-form-group>
            <b-form-group label="Username">
                <b-form-input v-model="modal.user.username" :disabled="isEditing" trim />
            </b-form-group>
            <b-form-group label="Password">
                <b-form-input v-model="modal.user.password" trim />
            </b-form-group>
            <b-form-group label="Role" v-if="!this.isAdmin">
                <b-form-select
                    v-model="modal.user.role"
                    :options="roles"
                    :disabled="isEditing"
                ></b-form-select>
            </b-form-group>
            <template slot="modal-footer">
                <b-button
                    class="float-right"
                    v-bind:class="{ 'btn-warning': !modal.deleting, 'btn-danger': modal.deleting }"
                    @click="remove()"
                    v-if="isEditing && !isAdmin"
                    >Delete</b-button
                >
                <b-button class="float-right" variant="primary" @click="save()">Save</b-button>
            </template>
        </b-modal>
    </b-container>
</template>

<script>
import http from '../services/http';

export default {
    data() {
        return {
            roles: ['Manager', 'User'],
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
            modal: {
                deleting: false,
                user: {},
            },
        };
    },
    computed: {
        isAdmin() {
            return this.modal.user.role == 'Admin';
        },
        isEditing() {
            return !!this.modal.user.id;
        },
        modalTitle() {
            const { fullName, username } = this.modal.user;

            return this.isEditing ? fullName || username : 'New user';
        },
    },
    methods: {
        async load() {
            const { data } = await http.get('/api/user');

            this.users = data;
        },
        create() {
            this.$root.$emit('bv::show::modal', 'user');
        },
        edit(user) {
            this.modal.user = { original: user, ...user };

            this.$root.$emit('bv::show::modal', 'user');
        },
        async save() {
            const { id, username, fullName, password, role, original } = this.modal.user;
            const form = { username, fullName, password, role };

            try {
                if (id) {
                    await http.put(`/api/user/${id}`, form);

                    Object.assign(original, form);
                } else {
                    const { data } = await http.post('/api/user/', form);

                    this.users.push(data);
                }

                this.$root.$emit('bv::hide::modal', 'user');
            } catch ({ message }) {
                alert(message);
            }
        },
        async remove() {
            if (this.modal.deleting) {
                const id = this.modal.user.id;

                await http.delete(`/api/user/${id}`);

                this.users = this.users.filter(user => user.id != id);

                this.$root.$emit('bv::hide::modal', 'user');
            } else {
                this.modal.deleting = true;
            }
        },
        reset() {
            this.modal.user = {};
            this.modal.deleting = false;
        },
    },
    async created() {
        await this.load();
    },
};
</script>
