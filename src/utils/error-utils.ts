import {Dispatch} from "redux";
import {appActions} from "app";
import {ResponseType} from "api/types";
import axios from "axios";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, rejectWithValue: Function, showError = true) => {
  if (showError) {
    dispatch(appActions.SetAppErrorMessageAC({errorMessage: data.messages[0] || 'Some error occurred'}))
  }
  dispatch(appActions.SetAppStatusAC({status: "failed"}))
  return rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleServerNetworkError = (e: any, dispatch: Dispatch, rejectWithValue: Function, showError = true) => {
  if (axios.isAxiosError<{ message: string }>(e)) {
    const error = e.response?.data ? e.response?.data : e
    if (showError) {
      dispatch(appActions.SetAppErrorMessageAC({errorMessage: error.message}))
      dispatch(appActions.SetAppStatusAC({status: "failed"}))
    }
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
  }
  return rejectWithValue({errors: ['unknown error'], fieldsErrors: undefined})
}