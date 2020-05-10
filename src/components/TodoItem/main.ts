import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import Checkbox from '@/components/Checkbox/Main.vue';
import { Props as CheckboxProps, Event as CheckboxEvent } from '@/components/Checkbox/main';
import { TodoItem } from '@/models/todo-item';

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
  checkboxIconName: string
}

export interface Props {
  data: TodoItem,
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
    }
  },

  computed: {
    checkboxIconName() {
      return this.data.complete ? 'radio_button_checked' : 'radio_button_unchecked'
    },
  },

  methods: {
    handleCheckboxClick() {
      this.$emit(Event.ClickCheckbox)
    },
    handlePlayClick() {
      this.$emit(Event.ClickPlay)
    },
  },

  render(h) {
    const checkboxProps: CheckboxProps = {
      checked: this.data.complete,
    }
    const checkboxListeners = {
      [CheckboxEvent.Click]: this.handleCheckboxClick
    }
    return h('div', { staticClass: 'todo-item' }, [
      h(Checkbox, { props: checkboxProps, on: checkboxListeners }),
      h('div', { staticClass: 'todo-item__text' }, this.data.name),
      h('div', { staticClass: 'todo-item__btn-play', on: { click: this.handlePlayClick } }, [
        h('span', { staticClass: 'material-icons' }, 'play_circle_outline'),
      ])
    ]);
  },
};

export default options;
