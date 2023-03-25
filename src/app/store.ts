import {Action} from 'redux';
import {ThunkAction} from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {FieldErrorType} from "api/types";
import {rootReducer} from "./redusers";

// непосредственно создаём store
export const store = configureStore({
  reducer: rootReducer,
})

//for hot reloading
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./redusers', () => {
    store.replaceReducer(rootReducer)
  })
}

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
