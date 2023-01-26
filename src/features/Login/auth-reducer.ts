import {AppThunkType} from "../../app/store";
import {authAPI, loginType} from "../../api/todolists-api";
import {SetAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

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
export const setIsLoggedInAC = (isLoggedIn: boolean) => ({type: 'login/SET-IS-LOGGED-IN', isLoggedIn} as const)

// thunks
export const loginTC = (data: loginType): AppThunkType => (dispatch) => {
    dispatch(SetAppStatusAC('loading'))
    authAPI.login(data)
        .then((data) => {
            if (data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(SetAppStatusAC("succeeded"))
            } else {
                handleServerAppError(data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
}
// export const loginTC1 = (data: loginType): AppThunkType => async (dispatch) => {
//     dispatch(SetAppStatusAC('loading'))
//     try {
//         const data = await authAPI.login(data)
//         if (data.resultCode === 0) {
//             dispatch(setIsLoggedInAC(true))
//             dispatch(SetAppStatusAC("succeeded"))
//         } else {
//             handleServerAppError(data, dispatch)
//         }
//     } catch (e: any) {
//         handleServerNetworkError(e, dispatch)
//     }
// }

// types
export type AuthActionsType =
    | ReturnType<typeof setIsLoggedInAC>


export type InitialStateType = {
    isLoggedIn: boolean
}