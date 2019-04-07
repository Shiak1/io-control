<template>
    <div>
        <div
            v-for="allowed in permitted"
            :key="`device-permission:${allowed.type}-${allowed.id || allowed.name}`"
            class="border-bottom mb-3 pb-2"
        >
            <span :class="allowed.type == 'Group' ? 'font-weight-bold' : ''">{{
                allowed.name
            }}</span>
            <button class="float-right close text-danger" @click="remove(allowed)">x</button>
        </div>

        <v-typeahead
            v-model="search"
            :data="available"
            :serializer="entry => entry.name"
            :minMatchingChars="1"
            @hit="add($event)"
            placeholder="Type to search..."
            ref="input"
        >
            <template v-slot:suggestion="{ data: { name, type }, htmlText: html }">
                <span class="font-weight-bold">{{ type }}: </span>
                <span v-html="html"></span>
            </template>
        </v-typeahead>
    </div>
</template>

<script>
import http from '../services/http';

import Typeahead from 'vue-bootstrap-typeahead';

let devices = [];
let groups = new Set();

export default {
    data() {
        return {
            search: null,
            available: [],
            permissions: {
                devices: [...this.devices],
                groups: [...this.groups],
            },
        };
    },

    props: ['devices', 'groups'],

    computed: {
        permitted() {
            const { devices, groups } = this.permissions;

            return groups
                .map(name => ({ name, type: 'Group' }))
                .concat(devices.map(({ name, id }) => ({ name, id, type: 'Device' })));
        },
    },

    components: {
        'v-typeahead': Typeahead,
    },

    watch: {
        search() {
            const devicePermissions = new Set(this.permissions.devices.map(({ id }) => id));
            const groupPermissions = new Set(this.permissions.groups);

            this.available = devices
                .filter(({ id }) => !devicePermissions.has(id))
                .map(device => ({ ...device, type: 'Device' }))
                .concat(
                    [...groups]
                        .filter(name => !groupPermissions.has(name))
                        .map(name => ({ name, type: 'Group' }))
                );
        },
    },

    methods: {
        add({ type, name, id }) {
            if (type == 'Group') {
                this.permissions.groups.push(name);
            } else {
                this.permissions.devices.push({ name, id });
            }

            this.$refs.input.inputValue = '';
            this.search = '';
        },
        remove({ type, name, id }) {
            if (type == 'Group') {
                this.permissions.groups = this.permissions.groups.filter(group => group != name);
            } else {
                this.permissions.devices = this.permissions.devices.filter(
                    ({ id: current }) => current != id
                );
            }
        },
    },

    async created() {
        devices = [];
        groups = new Set();

        const { data } = await http.get('/api/device');

        data.forEach(({ name, id, group }) => {
            devices.push({ name, id });

            if (group) {
                groups.add(group);
            }
        });
    },
};
</script>

<style scoped>
.close {
    font-size: inherit;
}
</style>
