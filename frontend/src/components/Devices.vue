<template>
    <b-container>
        <b-row class="mt-3">
            <b-col sm="auto"></b-col>
            <b-col>
                <b-table bordered :items="devices" :fields="fields">
                    <template slot="actions" slot-scope="row">
                        <b-button variant="success" @click="open(row.item)"></b-button>
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

        <b-modal id="device" title="New device" @hidden="reset()">
            <b-form-group label="Controller">
                <b-form-select
                    v-model="add.controller.name"
                    v-if="add.controller.source.value == 'select'"
                />
                <b-form-input
                    v-model="add.controller.name"
                    v-if="add.controller.source.value == 'new'"
                />
                <b-form-input v-model="add.controller.ip" v-if="add['controller-input'] == 'new'" />
                <b-button block size="sm" variant="link" @click="toggleControllerInput()">
                    {{ add.controller.source.value == 'select' ? 'New' : 'Select' }}
                </b-button>
            </b-form-group>
            <b-form-group label="Name">
                <b-form-input v-model="add.name" trim />
            </b-form-group>
            <b-form-group label="Relay">
                <b-form-input v-model="add.relay" trim />
            </b-form-group>
            <b-form-group label="Type">
                <b-form-select :options="add.type.options" v-model="add.type.value" trim />
            </b-form-group>
            <template slot="modal-footer">
                <b-button class="float-right" variant="primary" @click="saveNew()">Save</b-button>
            </template>
        </b-modal>
    </b-container>
</template>

<script>
import http from '../services/http';
import addStub from '../stubs/device';

export default {
    data() {
        return {
            fields: [
                {
                    key: 'name',
                    sortable: true,
                },
                {
                    label: '',
                    key: 'actions',
                },
            ],
            devices: [],
            edit: {},
            add: addStub(),
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
        reset() {
            this.add = addStub();
            this.toggleControllerInput();
            this.edit = {};
        },
        saveNew() {},

        toggleControllerInput() {
            const source = this.add.controller.source;

            source.value =
                source.value == source.options[1] ? source.options[0] : source.options[1];
        },
    },
    async created() {
        await this.load();
    },
};
</script>
