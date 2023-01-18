import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from '../../todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, updateTaskModelType} from "../../../../api/todolists-api";
import {AppRootStateType, AppThunkType} from "../../../../app/store";
import {SetAppStatusAC, SetAppStatusActionType} from "../../../../app/app-reducer";

const initialState: TasksStateType = {
    count: []
}
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

// thunks
export const FetchTasksTC = (todolistId: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.fetchTasks(todolistId)
        .then((data) => {
            dispatch(setTasksAC(todolistId, data.items))
            dispatch(SetAppStatusAC("succeeded"))
        })
}
export const RemoveTaskTC = (taskId: string, todolistId: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.deleteTask(todolistId, taskId)
        .then((data) => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(SetAppStatusAC("succeeded"))
        })
}
export const CreateTaskTC = (title: string, todolistId: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.createTask(todolistId, title)
        .then((data) => {
            dispatch(addTaskAC(todolistId, data.data.item))
            dispatch(SetAppStatusAC("succeeded"))
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
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((data) => {
                    dispatch(updateTaskAC(taskId, apiModel, todolistId))
                    dispatch(SetAppStatusAC("succeeded"))
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
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | SetAppStatusActionType

export type TasksStateType = {
    [key: string]: Array<TaskType>
}