import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps, PropType } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { State as PomodoroState } from '@/models/pomodoro-item';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {
  handleActionButtonClick(): void
}

export interface Computed {
  rootClassName: (Record<string, boolean> | string)[]
}

export interface Props {
  state: PomodoroState
  actived: boolean
  timeText: string
  todoName: string
}

export const enum Event {
  ClickPlay = 'click-play',
  ClickPause = 'click-pause',
}

export type Handlers = {
  [Event.ClickPlay](): void
  [Event.ClickPause](): void
}

const options: ComponentOption = {
  name: 'PomodoroRound',

  props: {
    state: {
      type: String as PropType<PomodoroState>,
      required: true,
    },
    actived: {
      type: Boolean,
      required: true,
    },
    timeText: {
      type: String,
      required: true,
    },
    todoName: {
      type: String,
      required: true,
    },
  },

  computed: {
    rootClassName() {
      return [{
        [`is-${this.state}`]: true,
      }]
    },
  },

  methods: {
    handleActionButtonClick() {
      if (this.actived) {
        this.$emit(Event.ClickPause)
      } else {
        this.$emit(Event.ClickPlay)
      }
    },
  },

  render(h) {
    return h('div', { staticClass: 'pomodoro-round', class: this.rootClassName }, [
      h('div', { staticClass: 'pomodoro-round__action-btn', on: { click: this.handleActionButtonClick } }, [
        h('div', { staticClass: 'pomodoro-round__action-btn-inner' }, [
          h('div', { staticClass: 'material-icons' },
            this.actived
              ? 'pause_circle_filled'
              : 'play_circle_filled'
          ),
        ])
      ]),
      h('div', { staticClass: 'pomodoro-round__content' }, [
        h('div', { staticClass: 'pomodoro-round__timer' }, this.timeText),
        h('div', { staticClass: 'pomodoro-round__todo' }, this.todoName),
      ]),
    ])
  },
};

export default options;
