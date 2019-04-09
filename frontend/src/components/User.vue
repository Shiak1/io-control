<template>
    <b-modal ref="modal" :header-class="showPermissions ? 'has-tabs' : ''" @hidden="closed">
        <template v-slot:modal-title>
            <span v-if="!showPermissions">{{ title }}</span>

            <ul class="nav" v-if="showPermissions">
                <li class="nav-item" v-for="tab in tabs.list" :key="`user-modal-tab${tab.key}`">
                    <a
                        href="#"
                        @click="tabs.current = tab.key"
                        class="nav-link"
                        :class="{ active: tabs.current == tab.key }"
                    >
                        <icon :icon="tab.icon" :viewBox="tab.viewBox"></icon>
                    </a>
                </li>
                <li class="rest"></li>
            </ul>
        </template>

        <device-permissions
            ref="permissions"
            v-if="tabs.current == 'permissions'"
            :devices="user.devices"
            :groups="user.groups"
        ></device-permissions>

        <div v-if="!showPermissions || tabs.current == 'details'">
            <div class="form-label-group">
                <b-form-input
                    id="user-fullName"
                    v-model="user.fullName"
                    placeholder="Name"
                    trim
                    ref="user.name"
                    v-on:keyup.enter="tab(0)"
                    autofocus
                />
                <label for="user-fullName">Name</label>
            </div>
            <div class="form-label-group">
                <b-form-input
                    id="user-username"
                    :disabled="isEditing"
                    v-model="user.username"
                    placeholder="Username"
                    trim
                    ref="user.username"
                    v-on:keyup.enter="tab(1)"
                />
                <label for="user-username">Username</label>
            </div>
            <div class="form-label-group">
                <b-form-input
                    id="user-password"
                    v-model="user.password"
                    placeholder="Password"
                    trim
                    ref="user.password"
                    v-on:keyup.enter="tab(2)"
                />
                <label for="user-password">Password</label>
            </div>
            <div class="form-label-group" v-if="!this.isAdmin">
                <b-form-select
                    v-model="user.role"
                    :disabled="isEditing"
                    ref="user.role"
                    v-on:keyup.enter="tab(3)"
                >
                    <template slot="first">
                        <option :value="null" hidden disabled>Role</option>
                    </template>

                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                </b-form-select>
            </div>
        </div>

        <template slot="modal-footer">
            <b-button
                class="float-right"
                v-bind:class="{ 'btn-warning': !deleting, 'btn-danger': deleting }"
                @click="deleting ? remove() : (deleting = true)"
                v-if="isEditing && !isAdmin"
                >Delete</b-button
            >
            <b-button class="float-right" variant="primary" @click="commit()" :disabled="!canSave"
                >Save</b-button
            >
        </template>
    </b-modal>
</template>

<script>
import http from '../services/http';

import Permissions from './Permissions';

function stub() {
    const { username, fullName, password, role, id, groups, devices } = {
        role: null,
        groups: [],
        devices: [],
    };

    return {
        user: { username, fullName, password, role, id, groups, devices },
        deleting: false,
        tabs: {
            list: [
                { key: 'details', icon: 'person' },
                { key: 'permissions', icon: 'key', viewBox: '0 0 14 16' },
            ],
            current: 'details',
        },
    };
}

const detailFields = {
    list: ['name', 'username', 'password', 'role'],
    get($refs, index) {
        return $refs['user.' + this.list[index]];
    },
};

export default {
    data: () => stub(),

    computed: {
        canSave() {
            const { username, fullName, password, role } = this.user;

            return username && fullName && role && (this.isEditing || password);
        },
        isAdmin() {
            return this.user.role == 'Admin';
        },
        isEditing() {
            return !!this.user.id;
        },
        isNew() {
            return !this.user.id;
        },
        isUser() {
            return this.user.role == 'User';
        },
        showPermissions() {
            return this.isEditing && this.isUser;
        },
        title() {
            return this.isEditing ? this.user.fullName || this.user.username : 'New user';
        },
    },

    methods: {
        tab(index) {
            if (!detailFields.get(this.$refs, index).value) return;

            this.tabTo(index + 1, index);
        },
        tabTo(next, startedAt) {
            next = next == detailFields.list.length ? 0 : next;

            if (next == startedAt) {
                this.commit();
            } else {
                this.focus(next, startedAt);
            }
        },
        focus(next, startedAt) {
            const field = detailFields.get(this.$refs, next);

            if (field.value) {
                this.tabTo(next + 1, startedAt);
            } else {
                field.focus();
            }
        },
        open({
            username,
            fullName,
            password,
            role = null,
            devices = [],
            deviceGroups = [],
            id,
        } = {}) {
            Object.assign(this.user, {
                username,
                fullName,
                password,
                role,
                id,
                devices,
                groups: deviceGroups,
            });

            this.$refs.modal.show();
        },
        close() {
            this.$refs.modal.hide();
        },
        closed() {
            Object.assign(this, stub());
        },

        getPermisions() {
            const { devices, groups } = this.$refs.permissions
                ? this.$refs.permissions.permissions
                : this.user;

            return { devices: devices.map(({ id }) => id), groups };
        },
        async commit() {
            this.isNew ? this.save() : this.update();
        },
        async save() {
            const { username, fullName, password, role } = this.user;

            try {
                const { data } = await http.post('/api/user/', {
                    username,
                    fullName,
                    password,
                    role,
                });

                this.$emit('created', data);

                this.close();
            } catch ({ message }) {
                alert(message);
            }
        },
        async update() {
            const { id, username, fullName, password } = this.user;
            const { devices, groups: deviceGroups } = this.getPermisions();

            try {
                await http.put(`/api/user/${id}`, {
                    username,
                    fullName,
                    password,
                    devices,
                    deviceGroups,
                });

                this.$emit('updated');

                this.close();
            } catch ({ message }) {
                alert(message);
            }
        },
        async remove() {
            await http.delete(`/api/user/${this.user.id}`);

            this.$emit('removed', this.user.id);

            this.close();
        },
    },

    components: {
        'device-permissions': Permissions,
    },
};
</script>

<style scoped>
.nav-link {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
}

.nav-item:first-of-type .nav-link.active {
    border-color: #fff #dee2e6 #fff #fff;
}

.nav-link.active {
    border-color: #fff #dee2e6 #fff #dee2e6;
}

.nav-link.active {
    color: #495057;
    background-color: #fff;
}

.nav-link {
    border-color: #fff #fff #dee2e6 #fff;
}

.nav-link:not(.active):hover {
    border-color: #e9ecef #e9ecef #fff #e9ecef;
}
</style>
