import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

type removeTodolistActionType = ReturnType<typeof RemoveTodolistAC>
type addTodolistActionType = ReturnType<typeof AddTodolistAC>
type changeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}
type changeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterValuesType
    }
}
type ActionType =
    removeTodolistActionType
    | addTodolistActionType
    | changeTodolistTitleActionType
    | changeTodolistFilterActionType

export const todolistsReducer = (state: Array<TodolistType>, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            return [...state, {
                id: v1(),
                title: action.title,
                filter: 'all'
            }]
        case 'CHANGE-TODOLIST-TITLE':
            return state
                .map(el => el.id === action.payload.id ? {...el, title: action.payload.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
        default:
            throw new Error('I don\'t understand this type')
    }
}

export const RemoveTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistId
    } as const
}
export const AddTodolistAC = (newTodolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        title: newTodolistTitle
    } as const
}
export const ChangeTodolistTitleAC = (todolistId: string, newTodolistTitle: string): changeTodolistTitleActionType => {
    return {
        type: "CHANGE-TODOLIST-TITLE",
        payload: {
            id: todolistId, title: newTodolistTitle
        }
    }
}
export const ChangeTodolistFilterAC = (todolistId: string, newFilter: FilterValuesType): changeTodolistFilterActionType => {
    return {
        type: "CHANGE-TODOLIST-FILTER",
        payload: {
            id: todolistId, filter: newFilter
        }
    }
}