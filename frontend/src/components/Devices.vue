<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table bordered :items="devices" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <span
                            v-b-tooltip.hover
                            title="Call"
                            class="oi oi-elevator mr-1 text-primary clickable"
                            @click="pulse(row.item)"
                            v-if="row.item.type == 'Elevator'"
                        ></span>
                        <div v-if="row.item.type == 'Door'">
                            <a
                                class="mr-1 text-success"
                                href="#"
                                @click="open(row.item)"
                                v-if="row.item.type == 'Door'"
                                >Open</a
                            >
                            <a
                                class="mr-1 text-danger"
                                href="#"
                                @click="close(row.item)"
                                v-if="row.item.type == 'Door'"
                                >Close</a
                            >
                            <a class="text-primary" href="#" @click="pulse(row.item)">Pulse</a>
                        </div>
                    </template>
                </b-table>
            </b-col>
            <b-col sm="auto"></b-col>
        </b-row>

        <device-modal
            v-on:saved="device => this.devices.push(device)"
            v-if="canCreateDevice"
        ></device-modal>
    </b-container>
</template>

<script>
import http from '../services/http';
import permissions from '../services/permissions';

import Device from './Device';

export default {
    data() {
        return {
            canCreateDevice: false,
            fields: [
                {
                    key: 'name',
                    sortable: true,
                },
                {
                    key: 'group',
                    sortable: true,
                },
                {
                    key: 'controller.name',
                    sortable: true,
                    label: 'Controller',
                },
                {
                    label: '',
                    key: 'actions',
                },
                {
                    label: '',
                    key: 'edit',
                },
            ],
            devices: [],
        };
    },
    methods: {
        async load() {
            const { data } = await http.get('/api/device');

            this.devices = data;
        },
        async open(device) {
            await http.post(`/api/device/${device._id}/state`, { state: 1 });
        },
        async close(device) {
            await http.post(`/api/device/${device._id}/state`, { state: 0 });
        },
        async pulse(device) {
            await http.post(`/api/device/${device._id}/state`, { state: 2 });
        },
        async loadCanCreateDevice() {
            this.canCreateDevice = await permissions.has('add-device');
        },
    },
    components: {
        'device-modal': Device,
    },
    async created() {
        await this.load();
        await this.loadCanCreateDevice();
    },
};
</script>
