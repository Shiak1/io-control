<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table outlined fixed :items="devices" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <span
                            v-b-tooltip.hover
                            title="Call"
                            class="oi oi-elevator text-primary clickable"
                            @click="pulse(row.item)"
                            v-if="row.item.type == 'Elevator'"
                        ></span>
                        <div class="d-inline" v-if="row.item.type == 'Door'">
                            <span
                                v-b-tooltip.hover
                                title="Open"
                                class="pr-2 border-right oi oi-lock-unlocked text-success clickable"
                                @click="open(row.item)"
                            >
                            </span>
                            <span
                                v-b-tooltip.hover
                                title="Close"
                                class="pl-2 pr-2 border-right oi oi-lock-locked text-danger clickable"
                                @click="close(row.item)"
                            ></span>
                            <span
                                v-b-tooltip.hover
                                title="Buzz"
                                class="pl-2 oi oi-clock text-primary clickable"
                                @click="pulse(row.item)"
                            >
                            </span>
                        </div>

                        <span
                            v-if="canCreateDevice"
                            v-b-tooltip.hover
                            title="Edit"
                            class="oi oi-pencil clickable float-right"
                            @click="$refs.device.showModal(row.item)"
                        ></span>
                    </template>
                    <template slot="edit" slot-scope="row"> </template>
                </b-table>
            </b-col>
            <b-col sm="auto"></b-col>
        </b-row>

        <device-modal
            ref="device"
            v-on:saved="saved"
            v-on:deleted="deleted"
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
            devices: [],
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
            ],
        };
    },
    methods: {
        async load() {
            const { data } = await http.get('/api/device');

            this.devices = data;
        },
        saved({ id, ...rest }) {
            const updating = this.devices.find(({ id: current }) => current == id);

            if (updating) {
                Object.assign(updating, rest);
            } else {
                this.devices.push({ id, ...rest });
            }
        },
        deleted(id) {
            this.devices = this.devices.filter(({ id: current }) => current != id);
        },
        async open(device) {
            await this.state(1, device);
        },
        async close(device) {
            await this.state(0, device);
        },
        async pulse(device) {
            await this.state(2, device);
        },
        state(state, { id }) {
            return http.post(`/api/device/${id}/state`, { state });
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
