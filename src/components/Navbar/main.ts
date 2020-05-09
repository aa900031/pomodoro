import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {
  handleNavTodoItemClick(): void
  handleNavAnalyticItemClick(): void
  handleNavRingtoneItemClick(): void
}

export interface Computed {

}

export interface Props {

}

export const enum Event {
  ClickTodo = 'click-todo',
  ClickAnalytic = 'click-analytic',
  ClickRingtone = 'click-ringtone',
}

const options: ComponentOption = {
  name: 'Navbar',

  methods: {
    handleNavTodoItemClick() {
      this.$emit(Event.ClickTodo)
    },
    handleNavAnalyticItemClick() {
      this.$emit(Event.ClickAnalytic)
    },
    handleNavRingtoneItemClick() {
      this.$emit(Event.ClickRingtone)
    },
  },

  render(h) {
    return h('div', { staticClass: 'navbar' }, [
      h('div', { staticClass: 'navbar__actions' }, [
        h('div', { staticClass: 'navbar__item', on: { click: this.handleNavTodoItemClick } }, [
          h('span', { staticClass: 'material-icons' }, 'list')
        ]),
        h('div', { staticClass: 'navbar__item', on: { click: this.handleNavAnalyticItemClick } }, [
          h('span', { staticClass: 'material-icons' }, 'insert_chart')
        ]),
        h('div', { staticClass: 'navbar__item', on: { click: this.handleNavRingtoneItemClick } }, [
          h('span', { staticClass: 'material-icons' }, 'library_music')
        ])
      ]),
      h('div', { staticClass: 'navbar__logo' }, 'POMODORO')
    ]);
  },
};

export default options;
