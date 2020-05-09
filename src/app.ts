import Vue from 'vue';
import VueRouter from 'vue-router';
import Root from './pages/Root/Main.vue';

export const createApp = (route: VueRouter) => new Vue({
  router: route,

  render(h) {
    return h(Root);
  },
});
