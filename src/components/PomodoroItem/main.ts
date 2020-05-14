import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps, PropType } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { VNode } from 'vue/types/umd';
import PomodoroCounterItem from '@/components/PomodoroCounterItem/Main.vue';
import { Props as PomodoroCounterItemProps } from '@/components/PomodoroCounterItem/main';
import Checkbox from '@/components/Checkbox/Main.vue';
import { Props as CheckboxProps, Event as CheckboxEvent } from '@/components/Checkbox/main';
import { State as PomodoroState } from '@/models/pomodoro-item';

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
  $$counters: VNode
  $$timer: VNode
  rootClassName: string[]
}

export interface Props {
  checked: boolean
  text: string
  timerText: string
  timerPercent: number
  counter: number
  state: PomodoroState
}

export const enum Event {
  ClickCheckbox = 'click-checkbox',
}

export type Handlers = {
  [Event.ClickCheckbox](): void
}

const options: ComponentOption = {
  name: 'PomodoroItem',

  props: {
    checked: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timerText: {
      type: String,
      required: true,
    },
    timerPercent: {
      type: Number,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
    },
    state: {
      type: String as PropType<PomodoroState>,
      required: true,
    },
  },

  computed: {
    $$counters() {
      const h = this.$createElement

      return h('div', { staticClass: 'pomodoro-item__counter-list' }, [
        Array(this.counter).fill(0).map((_, i) => {
          const key = `item-${i}`
          const isLast = i === (this.counter - 1)
          const props: PomodoroCounterItemProps = {
            percent: isLast && this.state === PomodoroState.Work ? this.timerPercent : 100
          }

          return h(PomodoroCounterItem, { key, props })
        }),
      ]);
    },
    $$timer() {
      const h = this.$createElement

      return h('div', { staticClass: 'pomodoro-item__timer' }, [
        this.timerText,
      ])
    },

    rootClassName() {
      return [`is-${this.state}`]
    },
  },

  methods: {
    handleCheckboxClick() {
      this.$emit(Event.ClickCheckbox)
    }
  },

  render(h) {
    const checkboxProps: CheckboxProps = {
      checked: this.checked,
    }
    const checkboxListeners = {
      [CheckboxEvent.Click]: this.handleCheckboxClick,
    }
    return h('div', { staticClass: 'pomodoro-item', class: this.rootClassName }, [
      h('div', { staticClass: 'pomodoro-item__todo-info' }, [
        h(Checkbox, { props: checkboxProps, on: checkboxListeners }),
        h('div', { staticClass: 'pomodoro-item__todo-content' }, [
          h('div', { staticClass: 'pomodoro-item__text' }, this.text),
          this.$$counters,
        ])
      ]),
      this.$$timer,
    ])
  },
};

export default options;
