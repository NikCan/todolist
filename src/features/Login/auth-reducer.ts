import {AppThunkType} from "../../app/store";
import {authAPI, loginType} from "../../api/todolists-api";
import {SetAppStatusAC, setIsInitializedAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ClearDataAC} from "../TodolistsList/todolists-reducer";

const initialState: InitialStateType = {
    isLoggedIn: false
}
export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}

        default:
            return state;
    }
}

// actions
export const SetIsLoggedInAC = (isLoggedIn: boolean) => ({type: 'login/SET-IS-LOGGED-IN', isLoggedIn} as const)

// thunks
export const loginTC = (authData: loginType): AppThunkType => async (dispatch) => {
    dispatch(SetAppStatusAC('loading'))
    try {
        const data = await authAPI.login(authData)
        if (data.resultCode === 0) {
            dispatch(SetIsLoggedInAC(true))
            dispatch(SetAppStatusAC("succeeded"))
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const logoutTC = (): AppThunkType => async (dispatch) => {
    dispatch(SetAppStatusAC('loading'))
    try {
        const data = await authAPI.logout()
        if (data.resultCode === 0) {
            dispatch(SetIsLoggedInAC(false))
            dispatch(ClearDataAC())
            dispatch(SetAppStatusAC("succeeded"))
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const initializeAppTC = (): AppThunkType => async (dispatch) => {
    try {
        const data = await authAPI.me()
        dispatch(setIsInitializedAC(true))
        if (data.resultCode === 0) {
            dispatch(SetIsLoggedInAC(true));
        } else {
            handleServerAppError(data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

// types
export type AuthActionsType =
    | ReturnType<typeof SetIsLoggedInAC>


export type InitialStateType = {
    isLoggedIn: boolean
}