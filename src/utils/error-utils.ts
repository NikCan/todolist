import {
    SetAppErrorMessageAC,
    SetAppStatusAC,
} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    dispatch(SetAppErrorMessageAC({errorMessage: data.messages[0] || 'Some error occurred'}))
    dispatch(SetAppStatusAC({status: "failed"}))
}
export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(SetAppErrorMessageAC({errorMessage: error.message}))
    dispatch(SetAppStatusAC({status: "failed"}))
}