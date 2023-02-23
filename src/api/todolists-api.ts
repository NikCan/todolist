import axios from "axios";
import {RequestStatusType} from "../app/app-reducer";

const instance = axios.create({
  withCredentials: true,
  headers: {
    'API-KEY': '08432b91-d4bc-4747-ad4e-b220e331fd94'
  },
  baseURL: 'https://social-network.samuraijs.com/api/1.1/'
})

// api
export const authAPI = {
  me() {
    return instance.get<ResponseType<{ id: number, email: string, login: string }>>('auth/me')
      .then((res) => res.data)
  },
  login(data: loginType) {
    return instance.post<ResponseType<{ userId: number }>>(`auth/login`, data)
      .then((res) => res.data)
  },
  logout() {
    return instance.delete<ResponseType>(`auth/login`)
      .then((res) => res.data)
  }
}
export const todolistAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>(`todo-lists`)
      .then((res) => res.data)
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>(`todo-lists`, {title})
      .then((res) => res.data)
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
      .then((res) => res.data)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
      .then((res) => res.data)
  },
  fetchTasks(todolistId: string) {
    return instance.get<getTasksType>(`todo-lists/${todolistId}/tasks`)
      .then((res) => res.data)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
      .then((res) => res.data)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
      .then((res) => res.data)
  },
  updateTask(todolistId: string, taskId: string, model: updateTaskModelType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
      .then((res) => res.data)
  },
}

// types
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
