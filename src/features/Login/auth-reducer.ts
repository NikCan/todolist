import {authAPI, FieldErrorType, loginType} from "api/todolists-api";
import {SetAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {ClearDataAC} from "../TodolistsList/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export const loginTC = createAsyncThunk<undefined, loginType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>('auth/login', async (authData, thunkAPI) => {
  thunkAPI.dispatch(SetAppStatusAC({status: 'loading'}))
  try {
    const data = await authAPI.login(authData)
    if (data.resultCode === 0) {
      thunkAPI.dispatch(SetAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
    }
  } catch (e) {
    if (axios.isAxiosError<{ message: string }>(e)) {
      const error = e.response?.data ? e.response?.data : e
      handleServerNetworkError(error, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
    return thunkAPI.rejectWithValue({errors: ['unknown error'], fieldsErrors: undefined})
  }
})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(SetAppStatusAC({status: 'loading'}))
  try {
    const data = await authAPI.logout()
    if (data.resultCode === 0) {
      thunkAPI.dispatch(ClearDataAC())
      thunkAPI.dispatch(SetAppStatusAC({status: 'succeeded'}))
    } else {
      handleServerAppError(data, thunkAPI.dispatch)
      return thunkAPI.rejectWithValue('error')
    }
  } catch (e: any) {
    handleServerNetworkError(e, thunkAPI.dispatch)
    return thunkAPI.rejectWithValue(e)
  }
})

const slice = createSlice({
  name: "auth",
  initialState: {isLoggedIn: false},
  reducers: {
    SetIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: builder => builder
    .addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    .addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false
    })
})

export const authReducer = slice.reducer
export const {SetIsLoggedInAC} = slice.actions
