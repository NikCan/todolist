import {FieldErrorType, loginType} from "api/types";
import {authAPI} from "api";
import {initializeAppTC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {ClearDataAC} from "../todolists-list";

export const loginTC = createAsyncThunk<
  undefined,
  loginType,
  { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
>(
  'auth/login',
  async (authData, thunkAPI) => {
    try {
      const data = await authAPI.login(authData)
      if (data.resultCode !== 0) {
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

export const logoutTC = createAsyncThunk(
  'auth/logout',
  async (param, thunkAPI) => {
    try {
      const data = await authAPI.logout()
      if (data.resultCode === 0) {
        thunkAPI.dispatch(ClearDataAC())
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
  reducers: {},
  extraReducers: builder => builder
    .addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    .addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false
    })
    .addCase(initializeAppTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    .addCase(initializeAppTC.rejected, (state) => {
      state.isLoggedIn = false
    })
})

export const authReducer = slice.reducer
