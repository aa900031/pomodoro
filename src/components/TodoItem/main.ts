import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import Checkbox from '@/components/Checkbox/Main.vue';
import { Props as CheckboxProps, Event as CheckboxEvent } from '@/components/Checkbox/main';

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
  checked: boolean
  text: string
}

export const enum Event {
  ClickCheckbox = 'click-checkbox',
  ClickPlay = 'click-play',
}

const options: ComponentOption = {
  name: 'TodoItem',

  props: {
    checked: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },

  computed: {
    checkboxIconName() {
      return this.checked ? 'radio_button_checked' : 'radio_button_unchecked'
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
      checked: this.checked,
    }
    const checkboxListeners = {
      [CheckboxEvent.Click]: this.handleCheckboxClick
    }
    return h('div', { staticClass: 'todo-item' }, [
      h(Checkbox, { props: checkboxProps, on: checkboxListeners }),
      h('div', { staticClass: 'todo-item__text' }, this.text),
      h('div', { staticClass: 'todo-item__btn-play', on: { click: this.handlePlayClick } }, [
        h('span', { staticClass: 'material-icons' }, 'play_circle_outline'),
      ])
    ]);
  },
};

export default options;
