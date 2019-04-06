<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table outlined fixed :items="devices" :fields="fields">
                    <template slot="controller.name" slot-scope="{ value, item }">
                        {{ value }}

                        <div
                            class="pl-2 d-inline icon-container clickable text-primary"
                            v-if="item.type == 'Elevator'"
                        >
                            <icon
                                icon="elevator"
                                v-bind:onClick="() => pulse(item)"
                                title="Call"
                            ></icon>
                        </div>

                        <div class="d-inline" v-if="item.type == 'Door'">
                            <div
                                class="pl-2 d-inline pr-2 border-right clickable text-success icon-container"
                            >
                                <icon
                                    icon="lock-unlocked"
                                    v-bind:onClick="() => open(item)"
                                    title="Unlock"
                                ></icon>
                            </div>
                            <div
                                class="d-inline pl-2 pr-2 border-right clickable text-danger icon-container"
                            >
                                <icon
                                    icon="lock-locked"
                                    v-bind:onClick="() => close(item)"
                                    title="Lock"
                                ></icon>
                            </div>

                            <div class="d-inline pl-2 clickable text-primary icon-container">
                                <icon
                                    icon="bell"
                                    v-bind:onClick="() => pulse(item)"
                                    title="Buzz"
                                ></icon>
                            </div>
                        </div>

                        <div class="float-right icon-container clickable" v-if="canCreateDevice">
                            <icon
                                title="Edit"
                                v-bind:onClick="() => $refs.device.showModal(item)"
                                icon="pencil"
                            >
                            </icon>
                        </div>
                    </template>
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
