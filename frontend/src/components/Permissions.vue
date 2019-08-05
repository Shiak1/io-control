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

        <v-autocomplete
            :search="search"
            :get-result-value="entry => entry.name"
            @submit="add($event)"
            placeholder="Type to search..."
            ref="input"
        >
            <template v-slot:result="{ result: { name, type }, props }">
                <li class="autocomplete-result" v-bind="props">
                    <span class="font-weight-bold">{{ type }}: </span>
                    <span v-html="name"></span>
                </li>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
import http from '../services/http';

import Autocomplete from '@trevoreyre/autocomplete-vue';

let devices = [];
let groups = new Set();

export default {
    data() {
        return {
            permissions: {
                devices: [...this.devices],
                groups: [...this.groups],
            },
        };
    },

    props: ['devices', 'groups'],

    computed: {
        available() {
            const devicePermissions = new Set(this.permissions.devices.map(({ id }) => id));
            const groupPermissions = new Set(this.permissions.groups);

            return devices
                .filter(({ id }) => !devicePermissions.has(id))
                .map(device => ({ ...device, type: 'Device' }))
                .concat(
                    [...groups]
                        .filter(name => !groupPermissions.has(name))
                        .map(name => ({ name, type: 'Group' }))
                );
        },
        permitted() {
            const { devices, groups } = this.permissions;

            return groups
                .map(name => ({ name, type: 'Group' }))
                .concat(devices.map(({ name, id }) => ({ name, id, type: 'Device' })));
        },
    },

    components: {
        'v-autocomplete': Autocomplete,
    },

    methods: {
        add({ type, name, id }) {
            if (type == 'Group') {
                this.permissions.groups.push(name);
            } else {
                this.permissions.devices.push({ name, id });
            }

            this.$refs.input.setValue('');
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
        search(input) {
            const devices = this.available;

            return input ? devices.filter(({ name }) => name.includes(input)) : devices;
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
