<template>
	<div class="flex">
		<b-card
			class="vertical-center mb-2"
			title="Hey jessica"
			tag="article"
			style="max-width: 20rem;"
		>
			<b-card-text>
				I love you
			</b-card-text>

			<b-button variant="primary" @click="logout">Logout</b-button>
		</b-card>
	</div>
</template>
<script>
import http from '../services/http';
export default {
	methods: {
		async logout() {
			await http.post('/logout');
		},
	},
};
</script>
