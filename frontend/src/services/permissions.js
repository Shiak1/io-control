import http from './http';

export default {
	async has(permission) {
		return (await http.get(`api/permissions/${permission}`)).data;
	},
};
