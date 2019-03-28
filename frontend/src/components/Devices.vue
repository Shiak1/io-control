<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table outlined fixed :items="devices" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <div class="icon-container d-inline" v-if="row.item.type == 'Elevator'">
                            <svg
                                viewBox="0 0 8 8"
                                class="clickable icon text-primary"
                                @click="pulse(row.item)"
                                v-b-tooltip.hover
                                title="Call"
                            >
                                <use xlink:href="/assets/svg/open-iconic.svg#elevator"></use>
                            </svg>
                        </div>

                        <div class="d-inline" v-if="row.item.type == 'Door'">
                            <span class="pr-2 border-right clickable">
                                <svg
                                    viewBox="0 0 8 8"
                                    class="icon text-success"
                                    @click="open(row.item)"
                                    v-b-tooltip.hover
                                    title="Unlock"
                                >
                                    <use
                                        xlink:href="/assets/svg/open-iconic.svg#lock-unlocked"
                                    ></use>
                                </svg>
                            </span>
                            <span class="pl-2 pr-2 border-right clickable">
                                <svg
                                    viewBox="0 0 8 8"
                                    class="icon text-danger"
                                    @click="close(row.item)"
                                    v-b-tooltip.hover
                                    title="Lock"
                                >
                                    <use xlink:href="/assets/svg/open-iconic.svg#lock-locked"></use>
                                </svg>
                            </span>

                            <span class="pl-2 clickable">
                                <svg
                                    viewBox="0 0 8 8"
                                    class="icon text-primary"
                                    @click="pulse(row.item)"
                                    v-b-tooltip.hover
                                    title="Buzz"
                                >
                                    <use xlink:href="/assets/svg/open-iconic.svg#bell"></use>
                                </svg>
                            </span>
                        </div>

                        <div
                            inline
                            class="float-right clickable icon-container"
                            v-if="canCreateDevice"
                        >
                            <svg
                                viewBox="0 0 8 8"
                                class="icon"
                                @click="$refs.device.showModal(row.item)"
                                v-b-tooltip.hover
                                title="Edit"
                            >
                                <use xlink:href="/assets/svg/open-iconic.svg#pencil"></use>
                            </svg>
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
