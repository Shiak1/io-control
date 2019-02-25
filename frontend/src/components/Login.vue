<template>
    <div class="flex">
        <div class="vertical-center">
            <b-card class="mb-2" align="center" title="Login">
                <b-alert show variant="danger" v-if="error">{{ error }}</b-alert>
                <b-form-group>
                    <b-form-input
                        id="username"
                        type="text"
                        v-model="form.username"
                        placeholder="Username"
                    />
                </b-form-group>

                <b-form-group>
                    <b-form-input
                        id="password"
                        type="password"
                        v-model="form.password"
                        placeholder="Password"
                    />
                </b-form-group>

                <b-form-group>
                    <b-button type="submit" variant="primary" block @click="login">Next</b-button>
                </b-form-group>
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            error: '',
        };
    },
    methods: {
        validate() {
            const { username, password } = this.form;

            return username && password;
        },
        setError(message) {
            this.error = message;
        },
        async login() {
            this.setError('');

            if (this.validate()) {
                this.submit();
            } else {
                this.setError('Username and password required');
            }
        },
        async submit() {
            try {
                await this.$http.post('api/authentication', this.form);

                this.$router.push('/');
            } catch ({ data: { message } }) {
                this.setError(message);
            }
        },
    },
};
</script>
