<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table bordered :items="devices" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <b-button size="sm" variant="success" @click="open(row.item)"
                            >Open</b-button
                        >
                    </template>
                </b-table>
            </b-col>
            <b-col sm="auto"></b-col>
        </b-row>

        <b-row>
            <b-col></b-col>
            <b-col cols="6"
                ><b-button variant="outline-primary" block @click="create"
                    ><span class="oi oi-plus" title="plus" aria-hidden="true"></span></b-button
            ></b-col>
            <b-col></b-col>
        </b-row>

        <new-device v-on:saved="device => this.devices.push(device)"></new-device>
    </b-container>
</template>

<script>
import http from '../services/http';
import NewDevice from './new-device';

export default {
    data() {
        return {
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
            devices: [],
            edit: {},
        };
    },
    methods: {
        async load() {
            const { data } = await http.get('/api/device');

            this.devices = data;
        },
        async create() {
            this.$root.$emit('bv::show::modal', 'device');
        },
    },
    components: {
        NewDevice,
    },
    async created() {
        await this.load();
    },
};
</script>
