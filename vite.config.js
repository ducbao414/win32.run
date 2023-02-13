import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		// basicSsl()
	],
	server: {
		host: true,
		// https: true,
		port: 3000
	}
};

export default config;
