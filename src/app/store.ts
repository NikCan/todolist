import {Action, combineReducers} from 'redux';
import {ThunkAction} from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {tasksReducer} from 'features/todolists-list/Todolist/Task';
import {todolistsReducer} from 'features/todolists-list';
import {appReducer} from "./app-reducer";
import {authReducer} from "features/auth";
import {FieldErrorType} from "api/types";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer
})

// непосредственно создаём store
export const store = configureStore({
  reducer: rootReducer,
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunkDispatchType = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  Action<string>
>
export type ThunkError = { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
