import { genRamdomId } from '@/utils/generator'

export type TodoId = string

export interface TodoItem {
  id: TodoId
  name: string
  complete: boolean
}

export const createTodoItem = (name: string): TodoItem => {
  return {
    id: genRamdomId(),
    name,
    complete: false
  }
}
