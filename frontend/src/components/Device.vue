<template>
    <b-row>
        <b-col></b-col>
        <b-col cols="6"
            ><b-button class="icon-container" variant="outline-primary" block @click="showModal()">
                <svg viewBox="0 0 8 8" class="clickable icon">
                    <use xlink:href="/assets/svg/open-iconic.svg#plus"></use>
                </svg> </b-button
        ></b-col>
        <b-col></b-col>

        <b-modal ref="modal" :title="title">
            <div v-if="showing('Controller')">
                <b-form-group v-if="controller.source == 'select'">
                    <b-form-select v-model="controller.selected">
                        <option :value="{}" disabled hidden>Select</option>
                        <option v-for="option in controller.options" v-bind:value="option">{{
                            option.name
                        }}</option>
                    </b-form-select>
                    <b-button
                        block
                        size="sm"
                        variant="link"
                        class="mt-0"
                        @click="setControllerSource('new')"
                    >
                        New
                    </b-button>
                </b-form-group>
                <div class="form-label-group" v-if="controller.source == 'new'">
                    <b-form-input
                        id="controller-name"
                        v-model="controller.selected.name"
                        placeholder="Name"
                    />
                    <label for="controller-name">Name</label>
                </div>
                <div class="form-label-group" v-if="controller.source == 'new'">
                    <b-form-input
                        id="controller-ip"
                        v-model="controller.selected.ip"
                        placeholder="IP"
                    />
                    <label for="controller-ip">IP</label>

                    <b-button
                        block
                        size="sm"
                        variant="link"
                        class="mt-0"
                        @click="setControllerSource('select')"
                        v-if="controller.options.length"
                    >
                        Select
                    </b-button>
                </div>
            </div>

            <div v-if="showing('Device')">
                <div class="form-label-group">
                    <b-form-input id="new-device-name" v-model="name" placeholder="Name" trim />
                    <label for="new-device-name">Name</label>
                </div>
                <div class="form-label-group">
                    <b-form-input
                        id="new-device-relay"
                        v-model="relay"
                        placeholder="Relay"
                        trim
                        :disabled="this.isEditing"
                    />
                    <label for="new-device-relay">Relay</label>
                </div>
                <div class="form-label-group">
                    <b-form-input id="new-device-group" v-model="group" placeholder="Group" trim />
                    <label for="new-device-group">Group</label>
                </div>
                <div class="form-label-group">
                    <b-form-select v-model="type">
                        <template slot="first">
                            <option :value="null" hidden disabled>Type</option>
                        </template>

                        <option value="Door">Door</option>
                        <option value="Elevator">Elevator</option>
                    </b-form-select>
                </div>
            </div>

            <template slot="modal-footer">
                <b-button
                    v-if="showing('Controller')"
                    class="float-right"
                    variant="primary"
                    @click="show('Device')"
                    :disabled="!controllerSelected"
                    >Next</b-button
                >

                <b-button
                    v-if="showing('Device') && !this.isEditing"
                    class="float-right"
                    variant="secondary"
                    @click="show('Controller')"
                    >Back</b-button
                >
                <b-button
                    v-if="this.isEditing"
                    class="float-right"
                    v-bind:class="{ 'btn-warning': !isDeleting, 'btn-danger': isDeleting }"
                    @click="isDeleting ? remove() : (isDeleting = true)"
                    >Delete</b-button
                >
                <b-button
                    v-if="showing('Device')"
                    class="float-right"
                    variant="primary"
                    @click="save()"
                    :disabled="!deviceEntered"
                    >Save</b-button
                >
            </template>
        </b-modal>
    </b-row>
</template>

<script>
import http from '../services/http';
import stub from '../stubs/device';

export default {
    data() {
        const { controller, ...rest } = stub();

        return { ...rest, controller, title: 'Controller' };
    },
    computed: {
        isEditing() {
            return !!this.id;
        },
        controllerSelected() {
            const { name, ip } = this.controller.selected;

            return name && ip;
        },
        deviceEntered() {
            const { name, relay, type } = this;

            return name && relay && type;
        },
    },
    methods: {
        setControllerSource(source) {
            this.controller.source = source;

            this.controller.selected = {};
        },
        show(step) {
            this.title = step;
        },
        showing(step) {
            return this.title == step;
        },
        fill({ controller = {}, id, name, group, type = null, relay, isDeleting = false }) {
            this.controller = stub().controller;
            this.controller.selected = controller;

            Object.assign(this, { id, name, group, type, relay, isDeleting });
        },
        async save() {
            const {
                controller: { selected: controller },
                name,
                relay,
                type,
                group,
            } = this;

            const form = {
                controller: {
                    ip: controller.ip,
                    name: controller.name,
                },
                name,
                relay,
                type,
                group,
            };

            form.id = await this.createOrUpdate(form);

            this.$emit('saved', form);

            this.$refs.modal.hide();
        },
        async createOrUpdate({ controller, name, type, relay, group }) {
            const { data } = this.isEditing
                ? await http.put(`/api/device/${this.id}`, { name, group, type })
                : await http.post('/api/device', {
                      controller,
                      name,
                      type,
                      relay,
                      group,
                  });

            return data._id;
        },
        async remove() {
            await http.delete(`/api/device/${this.id}`);

            this.$emit('deleted', this.id);

            this.$refs.modal.hide();
        },
        async loadControllers() {
            const controller = this.controller;

            const { data } = await http.get('/api/controllers');

            const controllers = (controller.options = data);

            controller.source = controllers.length ? 'select' : 'new';
        },
        showModal(device) {
            this.fill(device || {});

            this.loadControllers();

            this.show(device ? 'Device' : 'Controller');

            this.$refs.modal.show();
        },
    },
};
</script>
