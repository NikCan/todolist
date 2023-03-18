import {AppRootStateType} from "./store";
import {Provider} from "react-redux";
import React from "react";
import {combineReducers} from "redux";
import {tasksReducer} from "features/todolists-list/Todolist/Task";
import {todolistsReducer} from "features/todolists-list";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "api/types";
import {appReducer} from "app";
import thunk from "redux-thunk";
import {authReducer} from "features/auth";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

const initialGlobalState: AppRootStateType = {
  todolists: [
    {id: 'todolistId1', title: 'What to learn', filter: 'all', entityStatus: 'idle', order: 1, addedDate: ''},
    {
      id: 'todolistId2',
      title: 'What to buy',
      filter: 'all',
      entityStatus: 'loading',
      order: 2,
      addedDate: ''
    }
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
        todoListId: 'todolistId1',
        entityStatus: 'idle'
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
        todoListId: 'todolistId1',
        entityStatus: 'idle'
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
        todoListId: 'todolistId2',
        entityStatus: 'idle'
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
        todoListId: 'todolistId2',
        entityStatus: 'idle'
      }
    ]
  },
  app: {
    status: "succeeded",
    errorMessage: null,
    isInitialized: true
  },
  auth: {
    isLoggedIn: true
  }
}

export const storyBookStore = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
  preloadedState: initialGlobalState,
  reducer: rootReducer
})

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}