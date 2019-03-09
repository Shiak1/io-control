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
            <legend
                tabindex="-1"
                class="font-weight-bold col-form-label pt-0"
                id="__BVID__6__BV_label_"
            >
                Controller
            </legend>
            <b-form-group v-if="add.controller.source.value == 'select'">
                <b-form-select v-model="add.controller.name" />
                <b-button
                    block
                    size="sm"
                    variant="link"
                    class="mt-0"
                    @click="add.controller.source.value = 'new'"
                >
                    New
                </b-button>
            </b-form-group>
            <div class="form-label-group" v-if="add.controller.source.value == 'new'">
                <b-form-input
                    id="controller-name"
                    v-model="add.controller.name"
                    placeholder="Name"
                />
                <label for="controller-name">Name</label>
            </div>
            <div class="form-label-group" v-if="add.controller.source.value == 'new'">
                <b-form-input id="controller-ip" v-model="add.controller.ip" placeholder="IP" />
                <label for="controller-ip">IP</label>

                <b-button
                    block
                    size="sm"
                    variant="link"
                    class="mt-0"
                    @click="add.controller.source.value = 'select'"
                >
                    Select
                </b-button>
            </div>

            <div class="form-label-group">
                <b-form-input id="new-device-name" v-model="add.name" placeholder="Name" trim />
                <label for="new-device-name">Name</label>
            </div>
            <div class="form-label-group">
                <b-form-input id="new-device-relay" v-model="add.relay" placeholder="Relay" trim />
                <label for="new-device-relay">Relay</label>
            </div>
            <div class="form-label-group">
                <b-form-input id="new-device-group" v-model="add.group" placeholder="Group" trim />
                <label for="new-device-group">Group</label>
            </div>
            <div class="form-label-group">
                <b-form-select v-model="add.type">
                    <template slot="first">
                        <option :value="null" hidden disabled>Type</option>
                    </template>

                    <option value="Door">Door</option>
                    <option value="Elevator">Elevator</option>
                </b-form-select>
            </div>

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
            this.edit = {};
        },
        saveNew() {},
    },
    async created() {
        await this.load();
    },
};
</script>
