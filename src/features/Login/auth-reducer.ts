import {authAPI, FieldErrorType, loginType} from "../../api/todolists-api";
import {SetAppStatusAC, setIsInitializedAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ClearDataAC} from "../TodolistsList/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import axios from "axios";

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, loginType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>('auth/login', async (authData, thunkAPI) => {
  thunkAPI.dispatch(SetAppStatusAC({status: 'loading'}))
  try {
    const data = await authAPI.login(authData)
    if (data.resultCode === 0) {
      thunkAPI.dispatch(SetAppStatusAC({status: 'succeeded'}))
      return {isLoggedIn: true}
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

const slice = createSlice({
  name: "auth",
  initialState: {isLoggedIn: false},
  reducers: {
    SetIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: builder => builder.addCase(loginTC.fulfilled, (state, action) => {
    state.isLoggedIn = action.payload.isLoggedIn
  })
})

export const authReducer = slice.reducer
const {SetIsLoggedInAC} = slice.actions

// thunks
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

export const initializeAppTC = () => async (dispatch: Dispatch) => {
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