import { Store, Module } from 'vuex';
import { TodoId, TodoItem } from '@/models/todo-item';

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
    name: string
  }
  [Mutation.SetComplete]: {
    id: TodoId
    value: boolean,
  }
}

export const enum Getter {
  LatestList = 'latestList',
  CompleteList = 'completeList',
  NoCompleteList = 'noCompleteList',
}

export type GetterValue = {
  [Getter.LatestList]: TodoItem[]
  [Getter.CompleteList]: TodoItem[]
  [Getter.NoCompleteList]: TodoItem[]
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
      [Getter.LatestList]: (state): GetterValue[Getter.LatestList] => {
        const list: GetterValue[Getter.LatestList] = []
        state.indexes.forEach((id) => {
          const item = state.data[id]
          if (!item) return
          if (item.complete) return
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
    },

    mutations: {
      [Mutation.Add]: (state, { name }: MutationPayload[Mutation.Add]) => {
        const id = Date.now().toString()
        state.data[id] = {
          id,
          name,
          complete: false,
        }
        state.indexes.push(id)
      },
      [Mutation.SetComplete]: (state, { id, value }) =>  {
        const item = state.data[id]
        if (!item) return
        item.complete = value;
      },
    },
  }
  store.registerModule(path, module)
}
