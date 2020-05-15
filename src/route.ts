import VueRouter from 'vue-router';
import { config as homeRouteConfig } from '@/pages/Home/route';
import { config as todoListRouteConfig } from '@/pages/TodoList/route';

export const createRoute = () => new VueRouter({
  routes: [
    ...homeRouteConfig,
    ...todoListRouteConfig,
  ],
});
