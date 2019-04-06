<template>
    <div class="flex">
        <div class="vertical-center">
            <div class="card text-center">
                <div class="card-body">
                    <div class="card-title text-primary fadein h6">
                        Hi
                    </div>

                    <b-alert show variant="danger" v-if="error">{{ error }}</b-alert>

                    <b-form-group>
                        <b-form-input
                            id="username"
                            type="text"
                            v-model="form.username"
                            placeholder="Username"
                            autofocus
                            ref="username"
                            v-on:keyup.enter="enter('username')"
                        />
                    </b-form-group>

                    <b-form-group>
                        <b-form-input
                            id="password"
                            type="password"
                            v-model="form.password"
                            placeholder="Password"
                            ref="password"
                            v-on:keyup.enter="enter('password')"
                        />
                    </b-form-group>

                    <b-form-group>
                        <b-button type="submit" variant="outline-primary" block @click="login"
                            >Next</b-button
                        >
                    </b-form-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from '../services/http';

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
        enter(fieldName) {
            const empty = Object.entries(this.form)
                .map(([name, value]) => {
                    return {
                        input: this.$refs[name],
                        value,
                        name,
                    };
                })
                .filter(field => !field.value);

            if (empty.length) {
                if (empty.some(field => field.name == fieldName)) return;

                empty[0].input.focus();
            } else {
                this.login();
            }
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
                await http.post('api/authentication', this.form);
            } catch ({ message }) {
                this.setError(message);
            }
        },
    },
};
</script>

<style scoped>
@keyframes fade {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.fadein {
    animation-name: fade;
    animation-duration: 3s;
}
</style>
