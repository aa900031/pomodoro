import Vue from 'vue';
import VueRoute from 'vue-router';
import Vuex from 'vuex';
import { createStore } from './store';
import { createRoute } from './route';
import { createApp } from './app';

Vue.config.productionTip = false;
Vue.use(VueRoute);
Vue.use(Vuex);

const store = createStore();
const route = createRoute();
const app = createApp(route, store);
app.$mount('#app');
