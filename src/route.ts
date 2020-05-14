import VueRouter from 'vue-router';
import { config as homeRouteConfig } from '@/pages/Home/route';

export const createRoute = () => new VueRouter({
  routes: [
    ...homeRouteConfig,
  ],
});
