import App from './App.svelte';
import './global.css';

const hostElement = document.querySelector('#vizbox') || document.body;

const app = new App({
	target: hostElement,
});

console.log('running epivis version:', __VERSION__);
window.EPIVIS_VERSION = __VERSION__;

export default app;