import {
    AddTodolistActionType, ClearDataActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from '../../todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, updateTaskModelType} from "../../../../api/todolists-api";
import {AppRootStateType, AppThunkType} from "../../../../app/store";
import {RequestStatusType, SetAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import axios, {AxiosError} from "axios";

const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.apiModel} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
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
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        case "CLEAR-DATA":
            return {}
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    entityStatus: action.entityStatus
                } : t)
            }

        default:
            return state;
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId, todolistId}) as const
export const addTaskAC = (todolistId: string, task: TaskType) => ({type: 'ADD-TASK', todolistId, task}) as const
export const updateTaskAC = (taskId: string, apiModel: updateTaskModelType, todolistId: string) => {
    return {type: 'UPDATE-TASK', apiModel, todolistId, taskId} as const
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', todolistId, tasks}) as const
export const changeTaskEntityStatusAC = (taskId: string, todolistId: string, entityStatus: RequestStatusType) => {
    return {type: 'CHANGE-TASK-ENTITY-STATUS', taskId, todolistId, entityStatus} as const
}

// thunks
export const FetchTasksTC = (todolistId: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.fetchTasks(todolistId)
        .then((data) => {
            dispatch(setTasksAC(todolistId, data.items))
            dispatch(SetAppStatusAC("succeeded"))
        })
        .catch((e: AxiosError<{ message: string }>) => {
            const error = e.response?.data ? e.response?.data : e
            handleServerNetworkError(error, dispatch)
        })
}
export const RemoveTaskTC = (taskId: string, todolistId: string): AppThunkType => async (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'loading'))
    try {
        const data = await todolistAPI.deleteTask(todolistId, taskId)
        if (data.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(SetAppStatusAC("succeeded"))
            dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'succeeded'))
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError<{ message: string }>(e)) {
            const error = e.response?.data ? e.response?.data : e
            handleServerNetworkError(error, dispatch)
        }
    }
}
export const CreateTaskTC = (title: string, todolistId: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.createTask(todolistId, title)
        .then((data) => {
            if (data.resultCode === 0) {
                dispatch(addTaskAC(todolistId, data.data.item))
                dispatch(SetAppStatusAC("succeeded"))
            } else {
                handleServerAppError<{ item: TaskType }>(data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const UpdateTaskTC = (taskId: string, domainModel: UpdateDomainModelType, todolistId: string): AppThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
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
            dispatch(SetAppStatusAC("loading"))
            dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'loading'))
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((data) => {
                    if (data.resultCode === 0) {
                        dispatch(updateTaskAC(taskId, apiModel, todolistId))
                        dispatch(SetAppStatusAC("succeeded"))
                        dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'succeeded'))
                    } else {
                        handleServerAppError<{ item: TaskType }>(data, dispatch)
                    }
                })
                .catch((e) => {
                    handleServerNetworkError(e, dispatch)
                })
        }
    }


// types
type UpdateDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TaskActionsType =
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ClearDataActionType
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatusAC>

export type TasksStateType = {
    [key: string]: Array<TaskType>
}