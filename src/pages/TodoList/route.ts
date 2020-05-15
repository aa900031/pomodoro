import { RouteConfig } from 'vue-router';

export const ROUTE_NAME_TODO_LIST = 'todo-list';

export const config: RouteConfig[] = [{
  name: ROUTE_NAME_TODO_LIST,
  path: '/todo-list',
  component: () => import('./Main.vue'),
}];
