import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps, PropType } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { State as PomodoroState } from '@/models/pomodoro-item';
import Ring from './Ring.vue';
import {
  Props as RingProps,
} from './ring';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {
  handleBtnMainClick(): void
  handleBtnStopClick(): void
}

export interface Computed {
  rootClassName: (Record<string, boolean> | string)[]
}

export interface Props {
  state: PomodoroState
  actived: boolean
  timePercent: number
}

export const enum Event {
  ClickPlay = 'click-play',
  ClickPause = 'click-pause',
  ClickStop = 'click-stop',
}

export type Handlers = {
  [Event.ClickPlay](): void
  [Event.ClickPause](): void
  [Event.ClickStop](): void
}

const options: ComponentOption = {
  name: 'ProgressRound',

  props: {
    state: {
      type: String as PropType<PomodoroState>,
      required: true,
    },
    actived: {
      type: Boolean,
      required: true,
    },
    timePercent: {
      type: Number,
      required: true,
    }
  },

  computed: {
    rootClassName() {
      return [{
        'is-active': this.actived,
        [`is-${this.state}`]: true,
      }]
    },
  },

  methods: {
    handleBtnMainClick() {
      if (this.actived) {
        this.$emit(Event.ClickPause)
      } else {
        this.$emit(Event.ClickPlay)
      }
    },
    handleBtnStopClick() {
      this.$emit(Event.ClickStop)
    },
  },

  render(h) {
    const btnMainListeners = {
      click: this.handleBtnMainClick,
    }
    const btnStopListeners = {
      click: this.handleBtnStopClick,
    }

    const ringProps: RingProps = {
      percent: this.timePercent,
      state: this.state,
    }

    return h('div', { staticClass: 'progress-round', class: this.rootClassName }, [
      h(Ring, { props: ringProps }),
      h('div', { staticClass: 'progress-round__content' }, [
        h('div', { staticClass: 'progress-round__actions' }, [
          h('div', { staticClass: 'progress-round__btn-main', on: btnMainListeners }, [
            h('span', { staticClass: 'material-icons' },
              this.actived
                ? 'pause_circle_filled'
                : 'play_circle_filled'
            ),
          ]),
          h('div', { staticClass: 'progress-round__btn-stop', on: btnStopListeners }, [
            h('span', { staticClass: 'material-icons' }, 'stop'),
          ]),
        ])
      ])
    ])
  },
};

export default options;
