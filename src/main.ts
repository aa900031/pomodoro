import Vue from 'vue';
import VueRoute from 'vue-router';
import { createRoute } from './route';
import { createApp } from './app';

Vue.config.productionTip = false;
Vue.use(VueRoute);

const route = createRoute();
const app = createApp(route);
app.$mount('#app');
