import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, SetAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {FetchTasksTC} from "./Todolist/Task/tasks-reducer";
import {Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../../app/store";

const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: 'idle'}, ...state]
        case "SET-TODOLISTS":
            return action.todolists.map((el) => ({...el, filter: 'all', entityStatus: 'idle'}))
        case "CLEAR-DATA":
            return []
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return state;
    }
}

// actions
export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}
export const ClearDataAC = () => ({type: 'CLEAR-DATA'} as const)
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId}) as const
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist}) as const
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status} as const
}
// thunks
export const FetchTodolistsTC = () => (dispatch:ThunkDispatch<AppRootStateType, unknown, any>) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    todolistAPI.getTodolists()
        .then((data) => {
            dispatch(setTodolistsAC(data))
            dispatch(SetAppStatusAC({status: "succeeded"}))
            return data
        })
        .then((todolists) => {
            todolists.forEach((tl) => dispatch(FetchTasksTC(tl.id)))
        })
}

export const RemoveTodolistTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistAPI.deleteTodolist(id)
        .then((data) => {
            dispatch(removeTodolistAC(id))
            dispatch(SetAppStatusAC({status: "succeeded"}))
            dispatch(changeTodolistEntityStatusAC(id, 'succeeded'))
        })
}
export const AddTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    todolistAPI.createTodolist(title)
        .then((data) => {
            if (data.resultCode === 0) {
                dispatch(addTodolistAC(data.data.item))
                dispatch(SetAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError<{ item: TodolistType }>(data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
export const ChangeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistAPI.updateTodolist(id, title)
        .then((data) => {
            if (data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(SetAppStatusAC({status: "succeeded"}))
                dispatch(changeTodolistEntityStatusAC(id, 'succeeded'))
            } else {
                handleServerAppError(data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}

// types
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ClearDataActionType = ReturnType<typeof ClearDataAC>

export type TodolistActionsType =
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | AddTodolistActionType
    | ClearDataActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>


export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}