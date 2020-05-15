import Vue from 'vue';
import { Store, Module } from 'vuex';
import { State as PomodoroState, PomodoroItem, PomodoroId, Timer, createPomodoroItem, formatTimerToHuman } from '@/models/pomodoro-item';
import { TodoItem, TodoId } from '@/models/todo-item';
import { Getter as TodoGetter, GetterValue as TodoGetterValue } from './todo';

export interface State {
  active: boolean
  currentId: PomodoroId | null
  data: Record<PomodoroId, PomodoroItem>
}

export const enum Mutation {
  Add = 'ADD',
  ResetItemTimer = 'RESET_ITEM_TIMER',
  SetActive = 'SET_ACTIVE',
  SetCurrentId = 'SET_CURRENT_ID',
  SetItemNextState = 'SET_ITEM_NEXT_STATE',
  SetItemNextPeriodCount = 'SET_ITEM_NEXT_PERIOD_COUNT',
  SetItemNextTimer = 'SET_ITEM_NEXT_TIMER',
}

export type MutationPayload = {
  [Mutation.SetActive]: {
    value: State['active']
  },
  [Mutation.SetCurrentId]: {
    value: State['currentId']
  }
  [Mutation.Add]: {
    item: PomodoroItem
  }
  [Mutation.SetItemNextState]: {
    id: PomodoroId
  }
  [Mutation.ResetItemTimer]: {
    id: PomodoroId
  }
  [Mutation.SetItemNextPeriodCount]: {
    id: PomodoroId
  }
  [Mutation.SetItemNextTimer]: {
    id: PomodoroId
  }
}

export const enum Getter {
  CurrentItem = 'currentItem',
  CurrentTodoItem = 'currentTodoItem',
  CurrentTimerText = 'currentTimerText',
  CurrentTimerPercent = 'currentTimerPercent',
  CurrentState = 'currentState',
  IsActive = 'isActive',
  ItemByTodoId = 'itemByTodoId',
  NextItemByTodoId = 'nextItemByTodoId',
}

export type GetterValue = {
  [Getter.CurrentItem]: PomodoroItem | null
  [Getter.CurrentTodoItem]: TodoItem | null
  [Getter.CurrentTimerText]: string | null
  [Getter.CurrentTimerPercent]: number | null
  [Getter.CurrentState]: PomodoroState
  [Getter.IsActive]: boolean
  [Getter.ItemByTodoId]: (todoId: TodoId) => PomodoroItem | null
  [Getter.NextItemByTodoId]: (todoId: TodoId) => PomodoroItem | null
}

export const enum Action {
  Add = 'add',
  Play = 'play',
  PlayByTodoId = 'playByTodoId',
  Pause = 'pause',
  Stop = 'stop',
  Complete = 'complete',
}

export type ActionPayload = {
  [Action.Add]: {
    todoId: string
  }
  [Action.PlayByTodoId]: {
    todoId: string
  }
  [Action.Play]: {}
  [Action.Pause]: {}
  [Action.Stop]: {}
}

const createState = (): State => {
  return {
    active: false,
    currentId: null,
    data: {}
  }
}

export const regist = <RS>(store: Store<RS>, path: string = 'pomodoro') => {
  let _timer: number | null = null

  const module: Module<State, RS> = {
    namespaced: true,

    state: () => createState(),

    mutations: {
      [Mutation.SetActive](state, { value }: MutationPayload[Mutation.SetActive]) {
        state.active = value
      },
      [Mutation.SetCurrentId](state, { value }: MutationPayload[Mutation.SetCurrentId]) {
        state.currentId = value
      },
      [Mutation.Add](state, { item }: MutationPayload[Mutation.Add]) {
        Vue.set(state.data, item.id, item)
      },
      [Mutation.SetItemNextState](state, { id }: MutationPayload[Mutation.SetItemNextState]) {
        const item = state.data[id]
        if (!item) return

        switch (item.state) {
          case PomodoroState.Break:
            item.state = PomodoroState.Work
            item.timer = Timer[PomodoroState.Work]
            break;
          case PomodoroState.Work:
            item.state = PomodoroState.Break
            item.timer = Timer[PomodoroState.Break]
            break;
        }
      },
      [Mutation.ResetItemTimer](state, { id }: MutationPayload[Mutation.ResetItemTimer]) {
        const item = state.data[id]
        if (!item) return

        item.timer = Timer[item.state]
      },
      [Mutation.SetItemNextPeriodCount](state, { id }: MutationPayload[Mutation.SetItemNextPeriodCount]) {
        const item = state.data[id]
        if (!item) return
        item.periodCount += 1
      },
      [Mutation.SetItemNextTimer](state, { id }: MutationPayload[Mutation.SetItemNextTimer]) {
        const item = state.data[id]
        if (!item) return
        item.timer -= 1
      },
    },

    getters: {
      [Getter.CurrentItem]: ({ currentId, data }): GetterValue[Getter.CurrentItem] => {
        if (!currentId) return null
        const item = data[currentId]
        if (!item) return null

        return item
      },
      [Getter.CurrentTodoItem]: (state, getters, rootState, rootGetters): GetterValue[Getter.CurrentTodoItem] => {
        const currentItem: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem];
        if (!currentItem) return null
        const getTodoItemById: TodoGetterValue[TodoGetter.ItemById] = rootGetters[`todo/${TodoGetter.ItemById}`]
        const todoItem = getTodoItemById(currentItem.todoId)

        return todoItem
      },
      [Getter.CurrentTimerText]: (state, getters): GetterValue[Getter.CurrentTimerText] => {
        const currentItem: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem];
        if (!currentItem) return null

        return formatTimerToHuman(currentItem.timer)
      },
      [Getter.CurrentTimerPercent]: (state, getters): GetterValue[Getter.CurrentTimerPercent] => {
        const currentItem: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem];
        if (!currentItem) return null

        return currentItem.timer / Timer[currentItem.state]
      },
      [Getter.CurrentState]: (state, getters): GetterValue[Getter.CurrentState] => {
        const currentItem: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem];
        return currentItem ? currentItem.state : PomodoroState.Work
      },
      [Getter.IsActive]: (state, getters): GetterValue[Getter.IsActive] => {
        const currentItem: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem];
        if (!currentItem) return false

        return state.active
      },
      [Getter.ItemByTodoId]: (state): GetterValue[Getter.ItemByTodoId] => (todoId) => {
        const pomodoroId = Object.keys(state.data).find((id) => {
          const pomodoro = state.data[id]
          if (!pomodoro) return false
          return pomodoro.todoId === todoId
        })
        if (!pomodoroId) return null

        return state.data[pomodoroId]
      },
      [Getter.NextItemByTodoId]: (state, getters, rootState, rootGetters): GetterValue[Getter.NextItemByTodoId] => (todoId) => {
        const getNextTodoItem: TodoGetterValue[TodoGetter.NextItemById] = rootGetters[`todo/${TodoGetter.NextItemById}`]
        const nextTodoItem = getNextTodoItem(todoId)
        if (!nextTodoItem) return null
        const getItemByTodoId: GetterValue[Getter.ItemByTodoId] = getters[Getter.ItemByTodoId]
        return getItemByTodoId(nextTodoItem.id)
      }
    },

    actions: {
      async [Action.Add]({ commit, getters, state }, payload: ActionPayload[Action.Add]) {
        const pomodoroItem = createPomodoroItem(payload.todoId)

        commit(Mutation.Add, { item: pomodoroItem })

        if (!state.currentId) {
          const setCurrentIdPayload: MutationPayload[Mutation.SetCurrentId] = {
            value: pomodoroItem.id,
          }
          commit(Mutation.SetCurrentId, setCurrentIdPayload)
        }
      },
      async [Action.PlayByTodoId]({ commit, dispatch, getters }, payload: ActionPayload[Action.PlayByTodoId]) {
        const getItemByTodoId: GetterValue[Getter.ItemByTodoId] = getters[Getter.ItemByTodoId]
        const item = getItemByTodoId(payload.todoId)
        if (!item) return

        const setCurrentIdPayload: MutationPayload[Mutation.SetCurrentId] = {
          value: item.id,
        }
        commit(Mutation.SetCurrentId, setCurrentIdPayload)
        await dispatch(Action.Play)
      },
      async [Action.Play]({ commit, getters, dispatch }, payload: ActionPayload[Action.Play]) {
        await dispatch(Action.Pause)

        const item: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem]
        if (!item) {
          throw new Error('null of item')
        }

        const countdown = () => {
          const timerPayload: MutationPayload[Mutation.SetItemNextTimer] = {
            id: item.id,
          }
          commit(Mutation.SetItemNextTimer, timerPayload)

          if (item.timer <= 0) {
            if (item.state === PomodoroState.Break) {
              const setPeriodCountpayload: MutationPayload[Mutation.SetItemNextPeriodCount] = {
                id: item.id
              }
              commit(Mutation.SetItemNextPeriodCount, setPeriodCountpayload)
            }

            const setStatePayload: MutationPayload[Mutation.SetItemNextState] = {
              id: item.id
            }
            commit(Mutation.SetItemNextState, setStatePayload)

            dispatch(Action.Pause)
          }
        }

        const setActivePayload: MutationPayload[Mutation.SetActive] = {
          value: true,
        }
        commit(Mutation.SetActive, setActivePayload)
        _timer = setInterval(countdown, 1000)
      },
      [Action.Pause]({ commit, getters }, payload: ActionPayload[Action.Pause]) {
        const item: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem]
        if (!item) {
          throw new Error('null of item')
        }

        const setActivePayload: MutationPayload[Mutation.SetActive] = {
          value: false,
        }
        commit(Mutation.SetActive, setActivePayload)

        if (_timer) {
          clearInterval(_timer)
          _timer = null
        }
      },
      async [Action.Stop]({ commit, getters, dispatch }, payload: ActionPayload[Action.Stop]) {
        await dispatch(Action.Pause)

        const item: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem]
        if (!item) {
          throw new Error('null of item')
        }

        const resetItemTimerPayload: MutationPayload[Mutation.ResetItemTimer] = {
          id: item.id,
        }
        commit(Mutation.ResetItemTimer, resetItemTimerPayload)
      },
      async [Action.Complete]({ dispatch, commit, getters }) {
        const item: GetterValue[Getter.CurrentItem] = getters[Getter.CurrentItem]
        if (!item) {
          throw new Error('null of item')
        }
        const currentTodoId = item.todoId

        await dispatch(Action.Pause)

        const getNextItemByTodoId: GetterValue[Getter.NextItemByTodoId] = getters[Getter.NextItemByTodoId]
        const nextItem = getNextItemByTodoId(currentTodoId)

        const setCurrentIdPayload: MutationPayload[Mutation.SetCurrentId] = {
          value: nextItem ? nextItem.id : null
        }
        commit(Mutation.SetCurrentId, setCurrentIdPayload)
      },
    }
  }

  store.registerModule(path, module);
}
