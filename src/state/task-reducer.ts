import {TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

type ActionsType =
    removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
    | RemoveTodolistActionType
    | AddTodolistActionType

export type removeTaskActionType = ReturnType<typeof removeTaskAC>
export type addTaskActionType = ReturnType<typeof addTaskAC>
export type changeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type changeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [{
                    id: v1(),
                    title: action.title,
                    isDone: false
                }, ...state[action.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    id: t.id,
                    title: t.id,
                    isDone: action.isDone
                } : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    id: t.id,
                    title: action.title,
                    isDone: t.isDone
                } : t)
            }
        case 'REMOVE-TODOLIST':
            // let {[action.id]:[], ...rest} = {...state}
            // return rest
            let stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        case 'ADD-TODOLIST':
        return {...state, [action.todolistId]: []}
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistId,
            taskId
        }
    } as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId} as const
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}