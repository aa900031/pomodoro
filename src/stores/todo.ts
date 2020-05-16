import Vue from 'vue';
import { Store, Module } from 'vuex';
import { TodoId, TodoItem, createTodoItem } from '@/models/todo-item';
import { Action as PomodoroAction, ActionPayload as PomodoroActionPayload, Getter as PomodoroGetter, GetterValue as PomodoroGetterValue } from './pomodoro';

export interface State {
  data: Record<TodoId, TodoItem>
  indexes: TodoId[]
}

export const enum Mutation {
  Add = 'ADD',
  SetComplete = 'SET_COMPLETE',
}

export type MutationPayload = {
  [Mutation.Add]: {
    item: TodoItem
  }
  [Mutation.SetComplete]: {
    id: TodoId
    value: boolean
  }
}

export const enum Getter {
  LatestList = 'latestList',
  CompletedList = 'completedList',
  IncompleteList = 'incompleteList',
  ItemById = 'itemById',
  LatestIncompleteItem = 'latestIncompleteItem',
}

export type GetterValue = {
  [Getter.LatestList]: TodoItem[]
  [Getter.CompletedList]: TodoItem[]
  [Getter.IncompleteList]: TodoItem[]
  [Getter.ItemById]: (id: TodoId) => TodoItem | null
  [Getter.LatestIncompleteItem]: TodoItem | null
}

export const enum Action {
  Add = 'add',
  Toggle = 'toggle',
}

export type ActionPayload = {
  [Action.Add]: {
    name: string
  }
  [Action.Toggle]: {
    id: TodoId,
  }
}

const createState = (): State => {
  return {
    data: {},
    indexes: [],
  }
}

export const regist = <RS>(store: Store<RS>, path: string = 'todo') => {
  const module: Module<State, RS> = {
    namespaced: true,

    state: () => createState(),

    getters: {
      [Getter.LatestList]: (state, getters, rootState, rootGetters): GetterValue[Getter.LatestList] => {
        const list: GetterValue[Getter.LatestList] = []
        const currentPomodoroItem: PomodoroGetterValue[PomodoroGetter.CurrentItem] = rootGetters[`pomodoro/${PomodoroGetter.CurrentItem}`]

        state.indexes.slice().reverse().forEach((id) => {
          const item = state.data[id]
          if (!item) return
          if (item.complete) return
          if (currentPomodoroItem?.todoId === item.id) return
          if (list.length >= 3) return false

          list.push(item)
        })
        return list
      },
      [Getter.CompletedList]: (state): GetterValue[Getter.CompletedList] => {
        return state.indexes.filter((id) => {
          const item = state.data[id]
          if (!item) return false
          if (!item.complete) return false

          return true
        }).map((id) => {
          return state.data[id]
        })
      },
      [Getter.IncompleteList]: (state): GetterValue[Getter.IncompleteList] => {
        return state.indexes.filter((id) => {
          const item = state.data[id]
          if (!item) return false
          if (item.complete) return false

          return true
        }).map((id) => {
          return state.data[id]
        })
      },
      [Getter.ItemById]: (state): GetterValue[Getter.ItemById] => (id) => {
        return state.data[id]
      },
      [Getter.LatestIncompleteItem]: (state): GetterValue[Getter.LatestIncompleteItem] => {
        const latestId = state.indexes.slice().reverse().find((id) => {
          const item = state.data[id]
          if (!item) return false
          if (item.complete) return false
          return true
        })

        if (!latestId) return null
        return state.data[latestId]
      },
    },

    mutations: {
      [Mutation.Add]: (state, { item }: MutationPayload[Mutation.Add]) => {
        Vue.set(state.data, item.id, item)
        state.data[item.id] = item
        state.indexes.push(item.id)
      },
      [Mutation.SetComplete]: (state, { id, value }) =>  {
        const item = state.data[id]
        if (!item) return
        item.complete = value;
      },
    },

    actions: {
      async [Action.Add]({ commit, dispatch }, payload: ActionPayload[Action.Add]) {
        const todoItem = createTodoItem(payload.name)
        const addTodoItemPayload: MutationPayload[Mutation.Add] = {
          item: todoItem
        }
        commit(Mutation.Add, addTodoItemPayload)

        const addPomodoroItemPayload: PomodoroActionPayload[PomodoroAction.Add] = {
          todoId: todoItem.id,
        }
        await dispatch(`pomodoro/${PomodoroAction.Add}`, addPomodoroItemPayload, {
          root: true,
        })
      },
      async [Action.Toggle]({ commit, dispatch, getters, rootGetters }, payload: ActionPayload[Action.Toggle]) {
        const todoId = payload.id
        const getTodoItem: GetterValue[Getter.ItemById] = getters[Getter.ItemById]
        const targetTodoItem = getTodoItem(todoId)
        if (!targetTodoItem) return

        const nextCompleteValue = !targetTodoItem.complete
        const setCompletePayload: MutationPayload[Mutation.SetComplete] = {
          id: todoId,
          value: nextCompleteValue,
        }
        commit(Mutation.SetComplete, setCompletePayload)

        const isTargetTodoArePomodoroTodo = (() => {
          const currentTodoItem: PomodoroGetterValue[PomodoroGetter.CurrentTodoItem] = rootGetters[`pomodoro/${PomodoroGetter.CurrentTodoItem}`]
          return currentTodoItem === targetTodoItem
        })

        if (nextCompleteValue && isTargetTodoArePomodoroTodo()) {
          await dispatch(`pomodoro/${PomodoroAction.Complete}`, {}, { root: true })
        }
      },
    },
  }
  store.registerModule(path, module)
}
