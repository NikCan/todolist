import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {AppThunkType} from "../../app/store";

const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
        case "SET-TODOLISTS":
            return action.todolists.map((el) => ({...el, filter: 'all'}))
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

// thunks
export const SetTodolistsTC = (): AppThunkType => (dispatch) => {
    todolistAPI.getTodolists()
        .then((data) => {
            dispatch(setTodolistsAC(data))
        })
}
export const RemoveTodolistTC = (id: string): AppThunkType => (dispatch) => {
    todolistAPI.deleteTodolist(id)
        .then((data) => {
            dispatch(removeTodolistAC(id))
        })
}
export const AddTodolistTC = (title: string): AppThunkType => (dispatch) => {
    todolistAPI.createTodolist(title)
        .then((data) => {
            dispatch(addTodolistAC(data.data.item))
        })
}
export const ChangeTodolistTitleTC = (id: string, title: string): AppThunkType => (dispatch) => {
    todolistAPI.updateTodolist(id, title)
        .then((data) => {
            dispatch(changeTodolistTitleAC(id, title))
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

export type TodolistActionsType =
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}