import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import Checkbox from '@/components/Checkbox/Main.vue';
import { Props as CheckboxProps, Event as CheckboxEvent } from '@/components/Checkbox/main';
import { TodoItem } from '@/models/todo-item';
import { VNode } from 'vue/types/umd';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {
  handleCheckboxClick(): void
  handlePlayClick(): void
}

export interface Computed {
  $$btnPlay: VNode
  $$checkbox: VNode
  rootClassName: Record<string, boolean>[]
}

export interface Props {
  data: TodoItem
  white?: boolean
}

export const enum Event {
  ClickCheckbox = 'click-checkbox',
  ClickPlay = 'click-play',
}

export type Handlers = {
  [Event.ClickCheckbox](data: Props['data']): void
  [Event.ClickPlay](data: Props['data']): void
}

const options: ComponentOption = {
  name: 'TodoItem',

  props: {
    data: {
      type: Object,
      required: true,
    },
    white: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    rootClassName() {
      return [{
        'is-checked': this.data.complete,
        'is-white': !!this.white,
      }]
    },
    $$btnPlay() {
      const h = this.$createElement;
      if (this.data.complete) return h()

      return h('div', { staticClass: 'todo-item__btn-play', on: { click: this.handlePlayClick } }, [
        h('span', { staticClass: 'material-icons' }, 'play_circle_outline'),
      ])
    },
    $$checkbox() {
      const h = this.$createElement

      const props: CheckboxProps = {
        checked: this.data.complete,
      }
      const listeners = {
        [CheckboxEvent.Click]: this.handleCheckboxClick
      }

      return h(Checkbox, { props: props, on: listeners })
    },
  },

  methods: {
    handleCheckboxClick() {
      this.$emit(Event.ClickCheckbox, this.data)
    },
    handlePlayClick() {
      this.$emit(Event.ClickPlay, this.data)
    },
  },

  render(h) {
    return h('div', { staticClass: 'todo-item', class: this.rootClassName }, [
      this.$$checkbox,
      h('div', { staticClass: 'todo-item__text' }, this.data.name),
      this.$$btnPlay,
    ]);
  },
};

export default options;
