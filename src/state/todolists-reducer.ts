import {FilterValuesType, TodolistsType} from '../AppWithRedux';
import {v1} from 'uuid';
import {ActionsType} from "./store";

export type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodolistFilterAC>

export const RemoveTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const AddTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()} as const
}
export const ChangeTodolistTitleAC = (todolistId: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: title} as const
}
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: filter} as const
}

export let todolistId1 = v1();
export let todolistId2 = v1();

const initialState: TodolistsType = [
    // {id: todolistId1, title: "What to learn", filter: "all"},
    // {id: todolistId2, title: "What to buy", filter: "all"}
]
export const todolistsReducer = (state = initialState, action: ActionsType): TodolistsType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{id: action.todolistId, title: action.title, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {id: tl.id, title: action.title, filter: tl.filter} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {id: tl.id, title: tl.title, filter: action.filter} : tl)
        default:
            return state
    }
}


