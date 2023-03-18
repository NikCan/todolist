import {Dispatch} from "redux";
import {SetAppErrorMessageAC, SetAppStatusAC} from "app";
import {ResponseType} from "api/types";
import axios from "axios";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, rejectWithValue: Function, showError = true) => {
  if (showError) {
    dispatch(SetAppErrorMessageAC({errorMessage: data.messages[0] || 'Some error occurred'}))
  }
  dispatch(SetAppStatusAC({status: "failed"}))
  return rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleServerNetworkError = (e: any, dispatch: Dispatch, rejectWithValue: Function, showError = true) => {
  if (axios.isAxiosError<{ message: string }>(e)) {
    const error = e.response?.data ? e.response?.data : e
    if (showError) {
      dispatch(SetAppErrorMessageAC({errorMessage: error.message}))
      dispatch(SetAppStatusAC({status: "failed"}))
    }
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
  }
  return rejectWithValue({errors: ['unknown error'], fieldsErrors: undefined})
}