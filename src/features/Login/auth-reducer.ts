import {authAPI, loginType} from "../../api/todolists-api";
import {SetAppStatusAC, setIsInitializedAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ClearDataAC} from "../TodolistsList/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

const initialState = {
    isLoggedIn: false
}
const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        SetIsLoggedInAC(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer
const {SetIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (authData: loginType) => async (dispatch:Dispatch) => {
    dispatch(SetAppStatusAC({status: 'loading'}))
    try {
        const data = await authAPI.login(authData)
        if (data.resultCode === 0) {
            dispatch(SetIsLoggedInAC({isLoggedIn: true}))
            dispatch(SetAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(SetAppStatusAC({status: 'loading'}))
    try {
        const data = await authAPI.logout()
        if (data.resultCode === 0) {
            dispatch(SetIsLoggedInAC({isLoggedIn: false}))
            dispatch(ClearDataAC())
            dispatch(SetAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const initializeAppTC = () => async (dispatch:Dispatch) => {
    try {
        const data = await authAPI.me()
        dispatch(setIsInitializedAC({isInitialized: true}))
        if (data.resultCode === 0) {
            dispatch(SetIsLoggedInAC({isLoggedIn: true}));
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

// types