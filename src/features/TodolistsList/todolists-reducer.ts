import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {AppThunkType} from "../../app/store";
import {RequestStatusType, SetAppStatusAC, SetErrorMessageAC} from "../../app/app-reducer";

const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
        case "SET-TODOLISTS":
            return action.todolists.map((el) => ({...el, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return state;
    }
}

// actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId}) as const
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist}) as const
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}
export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status} as const
}
// thunks
export const SetTodolistsTC = (): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.getTodolists()
        .then((data) => {
            dispatch(setTodolistsAC(data))
            dispatch(SetAppStatusAC("succeeded"))
        })
}
export const RemoveTodolistTC = (id: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistAPI.deleteTodolist(id)
        .then((data) => {
            dispatch(removeTodolistAC(id))
            dispatch(SetAppStatusAC("succeeded"))
            dispatch(changeTodolistEntityStatusAC(id, 'succeeded'))
        })
}
export const AddTodolistTC = (title: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.createTodolist(title)
        .then((data) => {
            if (data.resultCode === 0) {
                dispatch(addTodolistAC(data.data.item))
                dispatch(SetAppStatusAC("succeeded"))
            } else {
                dispatch(SetErrorMessageAC(data.messages[0] || 'Some error occurred'))
                dispatch(SetAppStatusAC("failed"))
            }
        })
}
export const ChangeTodolistTitleTC = (id: string, title: string): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC("loading"))
    todolistAPI.updateTodolist(id, title)
        .then((data) => {
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(SetAppStatusAC("succeeded"))
        })
}

const _ChangeTodolistTitleTC = (id: string, title: string): AppThunkType => async (dispatch) => {
    const data = await todolistAPI.updateTodolist(id, title)
    dispatch(changeTodolistTitleAC(id, title))
}

// types
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

export type TodolistActionsType =
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | AddTodolistActionType
    | ChangeTodolistEntityStatusActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}