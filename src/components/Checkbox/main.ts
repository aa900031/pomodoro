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
  handleCheckboxClick(): void
}

export interface Computed {
  checkboxIconName: string
}

export interface Props {
  checked: boolean
}

export const enum Event {
  Click = 'click',
}

const options: ComponentOption = {
  name: 'Checkbox',

  props: {
    checked: {
      type: Boolean,
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
      this.$emit(Event.Click)
    },
  },

  render(h) {
    return h('div', { staticClass: 'checkbox', on: { click: this.handleCheckboxClick } }, [
      h('span', { staticClass: 'material-icons' }, this.checkboxIconName),
    ])
  },
};

export default options;
