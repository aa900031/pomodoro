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
  handleCloseClick(): void
}

export interface Computed {

}

export interface Props {
  visibleNavs: boolean
  visibleClose: boolean
}

export const enum Event {
  ClickTodo = 'click-todo',
  ClickAnalytic = 'click-analytic',
  ClickRingtone = 'click-ringtone',
  ClickClose = 'click-close',
}

export type Handlers = {
  [Event.ClickTodo](): void
  [Event.ClickAnalytic](): void
  [Event.ClickRingtone](): void
  [Event.ClickClose](): void
}

const options: ComponentOption = {
  name: 'Navbar',

  props: {
    visibleNavs: {
      type: Boolean,
      required: true,
    },
    visibleClose: {
      type: Boolean,
      required: true,
    },
  },

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
    handleCloseClick() {
      this.$emit(Event.ClickClose)
    }
  },

  render(h) {
    return h('div', { staticClass: 'navbar' }, [
      h('div', { staticClass: 'navbar__actions' }, [
        this.visibleClose ? [
          h('div', { staticClass: 'navbar__item', on: { click: this.handleCloseClick } }, [
            h('span', { staticClass: 'material-icons' }, 'clear')
          ]),
        ] : h(),
        this.visibleNavs ? [
          h('div', { staticClass: 'navbar__item', on: { click: this.handleNavTodoItemClick } }, [
            h('span', { staticClass: 'material-icons' }, 'list')
          ]),
          h('div', { staticClass: 'navbar__item', on: { click: this.handleNavAnalyticItemClick } }, [
            h('span', { staticClass: 'material-icons' }, 'insert_chart')
          ]),
          h('div', { staticClass: 'navbar__item', on: { click: this.handleNavRingtoneItemClick } }, [
            h('span', { staticClass: 'material-icons' }, 'library_music')
          ])
        ] : h()
      ]),
      h('div', { staticClass: 'navbar__logo' }, 'POMODORO')
    ]);
  },
};

export default options;
