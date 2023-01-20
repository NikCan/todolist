import {
    AppActionsType,
    SetAppErrorMessageAC,
    SetAppStatusAC,
} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<AppActionsType>) => {
    dispatch(SetAppErrorMessageAC(data.messages[0] || 'Some error occurred'))
    dispatch(SetAppStatusAC("failed"))
}
export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<AppActionsType>) => {
    dispatch(SetAppErrorMessageAC(error.message || 'Some error occurred'))
    dispatch(SetAppStatusAC("failed"))
}