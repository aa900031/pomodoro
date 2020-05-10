import Vuex, { Store } from 'vuex';
import { regist as registTodoModule } from './stores/todo';

export interface State {

}

export const createStore = (): Store<State> => {
  const store = new Vuex.Store<State>({})
  registTodoModule(store)

  return store
}
