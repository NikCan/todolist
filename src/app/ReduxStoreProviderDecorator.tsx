import {AppRootStateType} from "./store";
import {Provider} from "react-redux";
import React from "react";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/Todolist/Task/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {appReducer} from "./app-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        // {id: 'todolistId1', title: 'What to learn', filter: 'all', entityStatus: 'idle', order: 1, addedDate: ''},
        // {id: 'todolistId2', title: 'What to buy', filter: 'all', entityStatus: 'loading' order: 2, addedDate: ''}
    ],
    tasks: {
        'todolistId1': [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.New,
                order: 2,
                addedDate: '',
                description: 'asdasd',
                priority: TaskPriorities.High,
                deadline: '',
                startDate: '',
                todoListId: 'todolistId1'
            },
            {
                id: v1(), title: 'JS',
                status: TaskStatuses.Completed,
                order: 2,
                addedDate: '',
                description: '123123123',
                priority: TaskPriorities.High,
                deadline: '',
                startDate: '',
                todoListId: 'todolistId1'
            }
        ],
        'todolistId2': [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                order: 2,
                addedDate: '',
                description: 'kjhhgf',
                priority: TaskPriorities.Low,
                deadline: '',
                startDate: '',
                todoListId: 'todolistId2'
            },
            {
                id: v1(), title: 'React Book',
                status: TaskStatuses.New,
                order: 2,
                addedDate: '',
                description: '5tt5t5',
                priority: TaskPriorities.Middle,
                deadline: '',
                startDate: '',
                todoListId: 'todolistId2'
            }
        ]
    },
    app: {
        status: "idle",
        errorMessage: null
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState, applyMiddleware(thunk))

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}