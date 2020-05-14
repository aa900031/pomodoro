import Vuex, { Store } from 'vuex';
import { regist as registTodoModule } from './stores/todo';
import { regist as registPomodoroModule } from '@/stores/pomodoro';

export interface State {

}

export const createStore = (): Store<State> => {
  const store = new Vuex.Store<State>({})
  registTodoModule(store)
  registPomodoroModule(store)

  return store
}
