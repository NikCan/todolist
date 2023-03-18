import {RequestStatusType} from "../app/types";

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}

export enum TaskStatuses {
  New,
  InProgress,
  Completed,
  Draft,
}

export enum TaskPriorities {
  Low,
  Middle,
  High,
  Urgently,
  Later,
}

export type TaskType = updateTaskModelType & {
  id: string
  todoListId: string
  order: number
  addedDate: string
  entityStatus: RequestStatusType
}
export type updateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
export type ResponseType<T = {}> = {
  resultCode: number
  messages: Array<string>
  fieldsErrors?: Array<FieldErrorType>
  data: T
}
export type getTasksType = {
  items: TaskType []
  totalCount: number
  error: string | null
}
export type loginType = {
  email: string
  password: string
  rememberMe: false
  captcha?: string
}
export type FieldErrorType = { field: string, error: string }
