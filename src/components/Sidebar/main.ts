import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { ROUTE_NAME_TODO_LIST } from '@/pages/TodoList/route';
import { ROUTE_NAME_HOME } from '@/pages/Home/route';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {

}

export interface Computed {

}

export interface Props {

}

const options: ComponentOption = {
  name: 'Sidebar',

  render(h) {
    return h('div', { staticClass: 'sidebar' }, [
      h('router-link', {
        staticClass: 'sidebar__item',
        props: { to: { name: ROUTE_NAME_TODO_LIST } },
      }, [
        h('span', { staticClass: 'material-icons' }, 'list'),
        'TO-DO LIST',
      ]),
      h('router-link', {
        staticClass: 'sidebar__item',
        props: { to: { name: ROUTE_NAME_HOME } },
      }, [
        h('span', { staticClass: 'material-icons' }, 'insert_chart'),
        'ANALYTICS',
      ]),
      h('router-link', {
        staticClass: 'sidebar__item',
        props: { to: { name: ROUTE_NAME_HOME } },
      }, [
        h('span', { staticClass: 'material-icons' }, 'library_music'),
        'RINGTONES',
      ]),
    ])
  },
};

export default options;
