import Vue from 'vue';
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import NavBar from '@/components/Navbar/Main.vue';
import {
  Props as NavBarProps,
  Event as NavBarEvent,
  Handlers as NavBarHandlers,
} from '@/components/Navbar/main';
import TodoInputbar from '@/components/TodoInputbar/Main.vue';
import {
  Props as TodoInputbarProps,
  Event as TodoInputbarEvent,
  Handlers as TodoInputbarHandlers,
} from '@/components/TodoInputbar/main';
import TodoSection from '@/components/TodoSection/Main.vue';
import {
  Props as TodoSectionProps,
  Event as TodoSectionEvent,
  Handlers as TodoSectionHandlers,
} from '@/components/TodoSection/main';
import Sidebar from '@/components/Sidebar/Main.vue';
import PomodoroRound from '@/components/PomodoroRound/Main.vue';
import {
  Props as PomodoroRoundProps,
  Event as PomodoroRoundEvent,
  Handlers as PomodoroRoundHandlers,
} from '@/components/PomodoroRound/main';
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
import { ROUTE_NAME_HOME } from '@/pages/Home/route';
import { TodoId } from '@/models/todo-item';

export type ComponentOption = ThisTypedComponentOptionsWithRecordProps<Instance, Data, Methods, Computed, Props>;

export type ComponentInstance = CombinedVueInstance<Instance, Data, Methods, Computed, Props>;

export interface Instance extends Vue {

}

export interface Data {
  visibleIncompleteSectionBody: boolean
  visibleCompletedSectionBody: boolean
}

export interface Methods {
  handleCompleteTodoSectionHeaderClick: TodoSectionHandlers[TodoSectionEvent.ClickHeader]
  handleIncompleteTodoSectionHeaderClick: TodoSectionHandlers[TodoSectionEvent.ClickHeader]
  handleTodoSectionItemCheckboxClick: TodoSectionHandlers[TodoSectionEvent.ClickItemCheckbox]
  handleTodoSectionItemPlayClick: TodoSectionHandlers[TodoSectionEvent.ClickItemPlay]
  handleTodoInputbarSubmit: TodoInputbarHandlers[TodoInputbarEvent.Submit]
  handleNavbarClickClose: NavBarHandlers[NavBarEvent.ClickClose]
  handlePomodoroRoundPlayClick: PomodoroRoundHandlers[PomodoroRoundEvent.ClickPlay]
  handlePomodoroRoundPauseClick: PomodoroRoundHandlers[PomodoroRoundEvent.ClickPause]
  toggleTodoItem(id: TodoId): void
  playPomodoro(id: TodoId): void
}

export interface Computed {
  incompleteList: TodoGetterValue[TodoGetter.IncompleteList]
  completedList: TodoGetterValue[TodoGetter.CompletedList]
  currentTodoItem: PomodoroGetterValue[PomodoroGetter.CurrentTodoItem]
  currentPomodoroItem: PomodoroGetterValue[PomodoroGetter.CurrentItem]
  currentPomodoroTimerText: PomodoroGetterValue[PomodoroGetter.CurrentTimerText]
  currentPomodoroState: PomodoroGetterValue[PomodoroGetter.CurrentState]
  isPomodoroActive: PomodoroGetterValue[PomodoroGetter.IsActive]
}

export interface Props {

}

const options: ComponentOption = {
  name: 'TodoListPage',

  data() {
    return {
      visibleIncompleteSectionBody: true,
      visibleCompletedSectionBody: true,
    }
  },

  computed: {
    incompleteList() {
      return this.$store.getters[`todo/${TodoGetter.IncompleteList}`]
    },
    completedList() {
      return this.$store.getters[`todo/${TodoGetter.CompletedList}`]
    },
    currentTodoItem() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentTodoItem}`]
    },
    currentPomodoroItem() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentItem}`]
    },
    currentPomodoroTimerText() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentTimerText}`]
    },
    currentPomodoroState() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.CurrentState}`]
    },
    isPomodoroActive() {
      return this.$store.getters[`pomodoro/${PomodoroGetter.IsActive}`]
    },
  },

  methods: {
    handleTodoInputbarSubmit(formData) {
      const addTodoPayload: TodoActionPayload[TodoAction.Add] = {
        name: formData.name,
      }
      this.$store.dispatch(`todo/${TodoAction.Add}`, addTodoPayload)
    },
    handleNavbarClickClose() {
      this.$router.push({ name: ROUTE_NAME_HOME })
    },
    handleCompleteTodoSectionHeaderClick() {
      this.visibleCompletedSectionBody = !this.visibleCompletedSectionBody
    },
    handleIncompleteTodoSectionHeaderClick() {
      this.visibleIncompleteSectionBody = !this.visibleIncompleteSectionBody
    },
    handleTodoSectionItemCheckboxClick(item) {
      this.toggleTodoItem(item.id)
    },
    handleTodoSectionItemPlayClick(item) {
      this.playPomodoro(item.id)
    },
    handlePomodoroRoundPlayClick() {
      this.$store.dispatch(`pomodoro/${PomodoroAction.Play}`)
    },
    handlePomodoroRoundPauseClick() {
      this.$store.dispatch(`pomodoro/${PomodoroAction.Pause}`)
    },
    toggleTodoItem(id) {
      const togglePayload: TodoActionPayload[TodoAction.Toggle] = { id }
      this.$store.dispatch(`todo/${TodoAction.Toggle}`, togglePayload)
    },
    playPomodoro(id) {
      const playPayload: PomodoroActionPayload[PomodoroAction.PlayByTodoId] = {
        todoId: id,
      }
      this.$store.dispatch(`pomodoro/${PomodoroAction.PlayByTodoId}`, playPayload)
    },
  },

  render(h) {
    const $todoInputbar = (() => {
      const listeners = {
        [TodoInputbarEvent.Submit]: this.handleTodoInputbarSubmit,
      }
      return h(TodoInputbar, { on: listeners })
    })()

    const $navbar = (() => {
      const props: NavBarProps = {
        visibleClose: true,
        visibleNavs: false,
      }
      const listeners = {
        [NavBarEvent.ClickClose]: this.handleNavbarClickClose
      }
      return h(NavBar, { props, on: listeners })
    })()

    const $todoList = (() => {
      const incompleteSectionProps: TodoSectionProps = {
        title: 'TO-DO',
        data: this.incompleteList,
        visibleBody: this.visibleIncompleteSectionBody,
      }
      const incompleteSectionListeners = {
        [TodoSectionEvent.ClickHeader]: this.handleIncompleteTodoSectionHeaderClick,
        [TodoSectionEvent.ClickItemCheckbox]: this.handleTodoSectionItemCheckboxClick,
        [TodoSectionEvent.ClickItemPlay]: this.handleTodoSectionItemPlayClick,
      }

      const completedSectionProps: TodoSectionProps = {
        title: 'DONE',
        data: this.completedList,
        visibleBody: this.visibleCompletedSectionBody,
      }
      const completedSectionListener = {
        [TodoSectionEvent.ClickHeader]: this.handleCompleteTodoSectionHeaderClick,
        [TodoSectionEvent.ClickItemCheckbox]: this.handleTodoSectionItemCheckboxClick,
      }

      return h('div', { staticClass: 'todo-list__main' }, [
        h(TodoSection, {
          props: incompleteSectionProps,
          on: incompleteSectionListeners,
        }),
        h(TodoSection, {
          props: completedSectionProps,
          on: completedSectionListener,
        }),
      ])
    })()

    const $sidebar = (() => {
      return h('div', { staticClass: 'todo-list__sidebar-wrapper' }, [
        h(Sidebar),
      ])
    })()

    const $pomodoroRound = (() => {
      const {
        currentTodoItem: todo,
        currentPomodoroItem: pomodoro,
        currentPomodoroState: state,
        currentPomodoroTimerText: timerText,
        isPomodoroActive: active,
      } = this
      if (!todo || !pomodoro) return h()

      const props: PomodoroRoundProps = {
        state: state,
        actived: active,
        timeText: timerText!,
        todoName: todo.name,
      }
      const listeners = {
        [PomodoroRoundEvent.ClickPause]: this.handlePomodoroRoundPauseClick,
        [PomodoroRoundEvent.ClickPlay]: this.handlePomodoroRoundPlayClick,
      }
      return h(PomodoroRound, { props, on: listeners })
    })()

    return h('div', { staticClass: 'todo-list' }, [
      h('div', { staticClass: 'todo-list__left-wrapper' }, [
        $sidebar,
        $pomodoroRound,
      ]),
      h('div', { staticClass: 'todo-list__content-wrapper' }, [
        h('div', { staticClass: 'todo-list__content' }, [
          $todoInputbar,
          $todoList,
        ])
      ]),
      h('div', { staticClass: 'todo-list__right-wrapper' }, [
        $navbar,
      ]),
    ])
  },
};

export default options;
