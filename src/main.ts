import App from './App.svelte';
import './global.css';

declare const __VERSION__: string;

const hostElement = document.querySelector('#epivis') || document.body;

const app = new App({
  target: hostElement,
});

console.log('running epivis version:', __VERSION__);
(window as unknown as { EPIVIS_VERSION?: string }).EPIVIS_VERSION = __VERSION__;

export default app;
