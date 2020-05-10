import Vue from 'vue';
import VueRouter from 'vue-router';
import Root from './pages/Root/Main.vue';
import { Store } from 'vuex';

export const createApp = <S>(router: VueRouter, store: Store<S>) => new Vue({
  router,
  store,
  render(h) {
    return h(Root);
  },
});
