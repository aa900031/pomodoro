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

}

export interface Computed {
  isDoing: boolean
}

export interface Props {
  percent: number
}

const options: ComponentOption = {
  name: 'PomodoroCounterItem',

  props: {
    percent: {
      type: Number,
      required: true,
    }
  },

  computed: {
    isDoing() {
      return this.percent < 100
    },
  },

  render(h) {
    return h('div', {
      staticClass: 'pomodoro-counter-item',
      class: [{ 'is-doing': this.isDoing }]
    })
  },
};

export default options;
