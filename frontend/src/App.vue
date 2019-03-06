<template>
	<div id="app">
		<b-container v-if="loggedIn()">
			<b-row class="mt-3">
				<b-col sm="auto"></b-col>
				<b-col>
					<b-button class="float-right" variant="outline-info" @click="logout()"
						>Logout</b-button
					>
				</b-col>
				<b-col sm="auto"></b-col>
			</b-row>
		</b-container>
		<router-view />
	</div>
</template>

<script>
import http from './services/http';
export default {
	methods: {
		loggedIn() {
			return document.location.pathname != '/login';
		},
		async logout() {
			await http.post('/logout');
		},
	},
};
</script>
