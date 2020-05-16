import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps, PropType } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { State as PomodoroState } from '@/models/pomodoro-item';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {
  size: number
  strokeWidth: number
  radius: number
  csize: number
  circumference: number
}

export interface Methods {

}

export interface Computed {
  circleClassName: (Record<string, boolean> | string)[]
  circleStyle: Record<string, any>
}

export interface Props {
  percent: number
  state: PomodoroState
}

const options: ComponentOption = {
  props: {
    percent: {
      type: Number,
      required: true,
    },
    state: {
      type: String as PropType<PomodoroState>,
      required: true,
    },
  },
  data() {
    const size = 532
    const strokeWidth = 12
    const helfSize = size / 2
    const radius = helfSize - (strokeWidth / 2)
    return {
      size,
      strokeWidth: strokeWidth + 2,
      radius,
      csize: helfSize,
      circumference: radius * 2 * Math.PI,
    }
  },

  computed: {
    circleClassName() {
      return [{
        [`is-${this.state}`]: true,
      }]
    },
    circleStyle() {
      return {
        strokeDasharray: this.circumference,
        strokeDashoffset: this.percent * this.circumference,
      }
    }
  }
}

export default options;
