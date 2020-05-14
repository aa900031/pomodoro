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
  CompleteList = 'completeList',
  NoCompleteList = 'noCompleteList',
  ItemById = 'itemById',
  NextItemById = 'nextItemById',
}

export type GetterValue = {
  [Getter.LatestList]: TodoItem[]
  [Getter.CompleteList]: TodoItem[]
  [Getter.NoCompleteList]: TodoItem[]
  [Getter.ItemById]: (id: TodoId) => TodoItem | null
  [Getter.NextItemById]: (id: TodoId) => TodoItem | null
}

export const enum Action {
  Add = 'add',
  Complete = 'complete',
}

export type ActionPayload = {
  [Action.Add]: {
    name: string
  }
  [Action.Complete]: {
    id: TodoId
    value: boolean
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

        state.indexes.forEach((id) => {
          const item = state.data[id]
          if (!item) return
          if (item.complete) return
          if (currentPomodoroItem?.todoId === item.id) return
          if (list.length >= 3) return false

          list.push(item)
        })
        return list
      },
      [Getter.CompleteList]: (state): GetterValue[Getter.CompleteList] => {
        return state.indexes.filter((id) => {
          const item = state.data[id]
          if (!item) return false
          if (!item.complete) return false

          return true
        }).map((id) => {
          return state.data[id]
        })
      },
      [Getter.NoCompleteList]: (state): GetterValue[Getter.NoCompleteList] => {
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
      [Getter.NextItemById]: (state): GetterValue[Getter.NextItemById] => (id) => {
        const currentIndex = state.indexes.indexOf(id)
        if (currentIndex < 0) return null
        const nextId = state.indexes[currentIndex + 1]
        if (!nextId) return null
        return state.data[nextId]
      }
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
      async [Action.Complete]({ commit, dispatch, getters, rootGetters }, payload: ActionPayload[Action.Complete]) {
        const getTodoItem: GetterValue[Getter.ItemById] = getters[Getter.ItemById]
        const targetTodoItem = getTodoItem(payload.id)
        if (!targetTodoItem) return

        const isTargetTodoArePomodoroTodo = (() => {
          const currentTodoItem: PomodoroGetterValue[PomodoroGetter.CurrentTodoItem] = rootGetters[`pomodoro/${PomodoroGetter.CurrentTodoItem}`]
          return currentTodoItem === targetTodoItem
        })()

        if (isTargetTodoArePomodoroTodo) {
          await dispatch(`pomodoro/${PomodoroAction.Complete}`, {}, { root: true })
        }

        const setCompletePayload: MutationPayload[Mutation.SetComplete] = {
          ...payload,
        }
        commit(Mutation.SetComplete, setCompletePayload)
      },
    },
  }
  store.registerModule(path, module)
}
