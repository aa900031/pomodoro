import { RouteConfig } from 'vue-router';

export const ROUTE_NAME_HOME = 'home';

export const config: RouteConfig[] = [{
  name: ROUTE_NAME_HOME,
  path: '/',
  component: () => import('./Main.vue'),
}];
