import axios from "axios";

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TaskType = {
    id: string
    title: string
    description: string | null
    todoListId: string
    order: number
    status: number
    priority: number
    startDate: string | null
    deadline: string | null
    addedDate: string
}
export type updateTaskType = {
    title: string
    description: string | null
    status: number
    priority: number
    startDate: string | null
    deadline: string | null
}
export type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: T
} | null
export type getTasksType = {
    items: TaskType []
    totalCount: number
    error: string | null
} | null

const instance = axios.create({
    withCredentials: true,
    headers: {
        'API-KEY': '08432b91-d4bc-4747-ad4e-b220e331fd94'
    },
    baseURL: 'https://social-network.samuraijs.com/api/1.1/'
})

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
    getTasks(todolistId: string) {
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
    updateTask(todolistId: string, taskId: string, task: updateTaskType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, task)
            .then((res) => res.data)
    },
}