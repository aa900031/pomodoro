import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import NavBar from '@/components/Navbar/Main.vue';
import {
  Props as NavBarProps,
  Event as NavBarEvent,
} from '@/components/Navbar/main';
import TodoInputbar from '@/components/TodoInputbar/Main.vue';
import {
  Props as TodoInputbarProps,
  Event as TodoInputbarEvent,
  Handlers as TodoInputbarHandlers,
} from '@/components/TodoInputbar/main';
import PomodoroItem from '@/components/PomodoroItem/Main.vue';
import {
  Props as PomodoroItemProps,
  Event as PomodoroItemEvent,
  Handlers as PomodoroItemHandlers,
} from '@/components/PomodoroItem/main';
import LatestTodoList from '@/components/LatestTodoList/Main.vue';
import {
  Props as LatestTodoListProps,
  Event as LatestTodoListEvent,
  Handlers as LatestTodoListHandlers,
} from '@/components/LatestTodoList/main';
import ProgressRound from '@/components/ProgressRound/Main.vue';
import {
  Props as ProgressRoundProps,
  Event as ProgressRoundEvent,
  Handlers as ProgressRoundHandlers,
} from '@/components/ProgressRound/main';
import {
  Action as TodoAction,
  ActionPayload as TodoActionPayload,
  Getter as TodoGetter,
  GetterValue as TodoGetterValue,
} from '@/stores/todo';
import {
  Action as PomodoroAction,
  ActionPayload as PomodoroActionPayload,
  Getter as PomodoroGetter,
  GetterValue as PomodoroGetterValue,
} from '@/stores/pomodoro';
import { ROUTE_NAME_TODO_LIST } from '../TodoList/route';
import { TodoId } from '@/models/todo-item';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {

}

export interface Methods {
  handleTodoInputbarSubmit: TodoInputbarHandlers[TodoInputbarEvent.Submit]
  handleProgressRoundClickPlay: ProgressRoundHandlers[ProgressRoundEvent.ClickPlay]
  handleProgressRoundClickPause: ProgressRoundHandlers[ProgressRoundEvent.ClickPause]
  handleProgressRoundClickStop: ProgressRoundHandlers[ProgressRoundEvent.ClickStop]
  handleLatestTodoListClickItemPlay: LatestTodoListHandlers[LatestTodoListEvent.ClickItemPlay]
  handleLatestTodoListClickItemCheckbox: LatestTodoListHandlers[LatestTodoListEvent.ClickItemCheckbox]
  handleLatestTodoListClickMore: LatestTodoListHandlers[LatestTodoListEvent.ClickMore]
  handlePomodoroItemClickCheckbox: PomodoroItemHandlers[PomodoroItemEvent.ClickCheckbox]
  handleNavbarClickTodo(): void
  toggleTodoItem(id: TodoId): void
}

export interface Computed {
  latestTodoList: TodoGetterValue[TodoGetter.LatestList]
  currentPomodoroItem: PomodoroGetterValue[PomodoroGetter.CurrentItem]
  currentPomodoroTimerText: PomodoroGetterValue[PomodoroGetter.CurrentTimerText]
  currentPomodoroTimerPercent: PomodoroGetterValue[PomodoroGetter.CurrentTimerPercent]
  currentPomodoroState: PomodoroGetterValue[PomodoroGetter.CurrentState]
  currentTodoItem: PomodoroGetterValue[PomodoroGetter.CurrentTodoItem]
  isPomodoroActive: PomodoroGetterValue[PomodoroGetter.IsActive]
  rootClassName: string[]
}

export interface Props {

}

const options: ComponentOption = {
  name: 'HomePage',

  computed: {
    latestTodoList() {
      return this.$store.getters[`todo/${TodoGetter.LatestList}`];
    },
    currentPomodoroItem() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentItem}`]
    },
    currentTodoItem() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentTodoItem}`]
    },
    currentPomodoroTimerText() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentTimerText}`]
    },
    currentPomodoroTimerPercent() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentTimerPercent}`]
    },
    currentPomodoroState() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentState}`]
    },
    isPomodoroActive() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.IsActive}`]
    },
    rootClassName() {
      return [`is-${this.currentPomodoroState}`]
    },
  },

  methods: {
    handleNavbarClickTodo() {
      this.$router.push({ name: ROUTE_NAME_TODO_LIST })
    },
    handleTodoInputbarSubmit(formData) {
      const addTodoPayload: TodoActionPayload[TodoAction.Add] = {
        name: formData.name,
      }
      this.$store.dispatch(`todo/${TodoAction.Add}`, addTodoPayload)
    },
    handleProgressRoundClickPlay() {
      this.$store.dispatch(`pomodoro/${PomodoroAction.Play}`)
    },
    handleProgressRoundClickPause() {
      this.$store.dispatch(`pomodoro/${PomodoroAction.Pause}`)
    },
    handleProgressRoundClickStop() {
      this.$store.dispatch(`pomodoro/${PomodoroAction.Stop}`)
    },
    handleLatestTodoListClickItemPlay(item) {
      const playPayload: PomodoroActionPayload[PomodoroAction.PlayByTodoId] = {
        todoId: item.id,
      }
      this.$store.dispatch(`pomodoro/${PomodoroAction.PlayByTodoId}`, playPayload)
    },
    handleLatestTodoListClickItemCheckbox(item) {
      this.toggleTodoItem(item.id)
    },
    handleLatestTodoListClickMore() {
      this.$router.push({ name: ROUTE_NAME_TODO_LIST })
    },
    handlePomodoroItemClickCheckbox() {
      const todoItem = this.currentTodoItem
      if (!todoItem) return

      this.toggleTodoItem(todoItem.id)
    },
    toggleTodoItem(id) {
      const togglePayload: TodoActionPayload[TodoAction.Toggle] = { id }
      this.$store.dispatch(`todo/${TodoAction.Toggle}`, togglePayload)
    },
  },

  render(h) {
    const {
      currentTodoItem: todo,
      currentPomodoroItem: pomodoro,
      currentPomodoroTimerText: timerText,
      currentPomodoroTimerPercent: timerPercent,
      currentPomodoroState: pomodoroState,
      isPomodoroActive
    } = this

    const $progressRound = (() => {
      if (!pomodoro || !timerPercent) return h()
      const props: ProgressRoundProps = {
        state: pomodoroState,
        actived: isPomodoroActive,
        timePercent: timerPercent,
      }
      const listeners = {
        [ProgressRoundEvent.ClickPlay]: this.handleProgressRoundClickPlay,
        [ProgressRoundEvent.ClickPause]: this.handleProgressRoundClickPause,
        [ProgressRoundEvent.ClickStop]: this.handleProgressRoundClickStop,
      }

      return h(ProgressRound, { props, on: listeners })
    })()

    const $pomodoroItem = (() => {
      if (!pomodoro || !todo) return h()

      const props: PomodoroItemProps = {
        checked: todo.complete,
        text: todo.name,
        timerText: timerText!,
        timerPercent: timerPercent!,
        counter: pomodoro.periodCount,
        state: pomodoroState,
      }
      const listeners = {
        [PomodoroItemEvent.ClickCheckbox]: this.handlePomodoroItemClickCheckbox,
      }

      return h(PomodoroItem, { props, on: listeners })
    })()

    const $todoInputbar = (() => {
      const props: TodoInputbarProps = {
        state: pomodoroState,
      }
      const listeners = {
        [TodoInputbarEvent.Submit]: this.handleTodoInputbarSubmit,
      }
      return h(TodoInputbar, { props, on: listeners })
    })()

    const $todoList = (() => {
      const props: LatestTodoListProps = {
        data: this.latestTodoList,
        state: pomodoroState,
      }
      const listeners = {
        [LatestTodoListEvent.ClickItemPlay]: this.handleLatestTodoListClickItemPlay,
        [LatestTodoListEvent.ClickItemCheckbox]: this.handleLatestTodoListClickItemCheckbox,
        [LatestTodoListEvent.ClickMore]: this.handleLatestTodoListClickMore,
      }
      return h(LatestTodoList, { props, on: listeners })
    })()

    const $navbar = (() => {
      const props: NavBarProps = {
        visibleClose: false,
        visibleNavs: true,
      }
      const listeners = {
        [NavBarEvent.ClickTodo]: this.handleNavbarClickTodo
      }
      return h(NavBar, { props, on: listeners })
    })()

    return h('div', { staticClass: 'home', class: this.rootClassName }, [
      h('div', { staticClass: 'home__todo-warpper' }, [
        h('div', { staticClass: 'home__todo-inputbar-wrapper' }, [
          $todoInputbar,
        ]),
        h('div', { staticClass: 'home__todo-current-wrapper' }, [
          $pomodoroItem,
        ]),
        h('div', { staticClass: 'home__todo-list-wrapper' }, [
          $todoList,
        ])
      ]),
      h('div', { staticClass: 'home__progress-round-wrapper' }, [
        $progressRound,
      ]),
      h('div', { staticClass: 'home__navbar-wrapper' }, [
        $navbar,
      ])
    ]);
  },
};

export default options;
