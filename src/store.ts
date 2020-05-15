import Vuex, { Store } from 'vuex';
import { regist as registTodoModule, Action as TodoAction, ActionPayload as TodoActionPayload } from './stores/todo';
import { regist as registPomodoroModule } from '@/stores/pomodoro';

export interface State {

}

export const createStore = (): Store<State> => {
  const store = new Vuex.Store<State>({})
  registTodoModule(store)
  registPomodoroModule(store)
  mockData(store)

  return store
}

const mockData = (store: Store<State>) => {
  Array.from(new Array(10)).forEach((item, i) => {
    const payload: TodoActionPayload[TodoAction.Add] = {
      name: `Todo Item ${i + 1}`,
    }
    store.dispatch(`todo/${TodoAction.Add}`, payload)
  });
}
