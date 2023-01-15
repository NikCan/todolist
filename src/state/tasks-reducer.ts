import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, updateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>

type ActionsType = RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
const initialState: TasksStateType = {
    count: []
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }

        case 'ADD-TASK': {
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        }

        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t, ...action.apiModel
                } : t)
            }
        }

        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }

        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }

        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }

        case "SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }

        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const
}
export const addTaskAC = (todolistId: string, task: TaskType) => {
    return {type: 'ADD-TASK', todolistId, task} as const
}
export const updateTaskAC = (taskId: string, apiModel: updateTaskModelType, todolistId: string) => {
    return {type: 'UPDATE-TASK', apiModel, todolistId, taskId} as const
}
// export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
//     return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId} as const
// }
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}

export const FetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.fetchTasks(todolistId)
        .then((data) => {
            dispatch(setTasksAC(todolistId, data.items))
        })
}

export const RemoveTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todolistId, taskId)
        .then((data) => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const CreateTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then((data) => {
            dispatch(addTaskAC(todolistId, data.data.item))
        })
}

type UpdateDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export const UpdateTaskTC = (taskId: string, domainModel: UpdateDomainModelType, todolistId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const apiModel: updateTaskModelType = {
            title: task.title,
            status: task.status,
            startDate: task.startDate,
            deadline: task.deadline,
            priority: task.priority,
            description: task.description,
            ...domainModel
        }
        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then((data) => {
                dispatch(updateTaskAC(taskId, apiModel, todolistId))
            })
    }
}
