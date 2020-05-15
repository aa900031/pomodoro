import { TodoId } from './todo-item';
import { genRamdomId } from '@/utils/generator';

export enum State {
  Work = 'work',
  Break = 'break',
}

export type PomodoroId = string

export interface PomodoroItem {
  id: PomodoroId
  todoId: TodoId
  state: State
  timer: number
  periodCount: number
}

export const Timer = Object.freeze({
  [State.Work]: 25 * 60,
  [State.Break]: 5 * 60,
})

export const createPomodoroItem = (todoId: TodoId) => {
  return {
    id: genRamdomId(),
    todoId,
    state: State.Work,
    timer: Timer[State.Work],
    periodCount: 1,
  }
}

export const formatTimerToHuman = (timer: number): string => {
  if (typeof timer !== 'number' || isNaN(timer)) return '-'

  let m = Math.floor(timer / 60).toString()
  if (m.length === 1) m = `0${m}`
  let s = Math.floor(timer % 60).toString()
  if (s.length === 1) s = `0${s}`
  return `${m}:${s}`
}
