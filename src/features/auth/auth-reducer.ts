import {FieldErrorType, loginType} from "api/types";
import {authAPI} from "api";
import {initializeApp} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {todolistsActions} from "../todolists-list";

export const loginTC = createAsyncThunk<undefined, loginType,
  { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
>(
  'auth/login',
  async (authData, thunkAPI) => {
    try {
      const data = await authAPI.login(authData)
      if (data.resultCode !== 0) {
        return handleServerAppError(data, thunkAPI.dispatch, thunkAPI.rejectWithValue)
      }
    } catch (e) {
      return handleServerNetworkError(e, thunkAPI.dispatch, thunkAPI.rejectWithValue)
    }
  })

export const logoutTC = createAsyncThunk<undefined, undefined,
  { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
>(
  'auth/logout',
  async (param, thunkAPI) => {
    try {
      const data = await authAPI.logout()
      if (data.resultCode === 0) {
        thunkAPI.dispatch(todolistsActions.ClearDataAC())
      } else {
        return handleServerAppError(data, thunkAPI.dispatch, thunkAPI.rejectWithValue)
      }
    } catch (e: any) {
      return handleServerNetworkError(e, thunkAPI.dispatch, thunkAPI.rejectWithValue)
    }
  })

const slice = createSlice({
  name: "auth",
  initialState: {isLoggedIn: false},
  reducers: {},
  extraReducers: builder => builder
    .addMatcher(isAnyOf(loginTC.fulfilled, initializeApp.fulfilled), (state) => {
      state.isLoggedIn = true
    })
    .addMatcher(isAnyOf(loginTC.rejected, initializeApp.rejected), (state) => {
      state.isLoggedIn = false
    })
})

export const {reducer: authReducer} = slice
