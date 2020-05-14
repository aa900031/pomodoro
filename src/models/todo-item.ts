export type TodoId = string

export interface TodoItem {
  id: TodoId
  name: string
  complete: boolean
}

export const createTodoItem = (name: string): TodoItem => {
  return {
    id: Date.now().toString(),
    name,
    complete: false
  }
}
