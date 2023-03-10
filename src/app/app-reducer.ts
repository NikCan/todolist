import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {SetIsLoggedInAC} from "features/Login/auth-reducer";

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch, rejectWithValue}) => {
  try {
    const data = await authAPI.me()
    if (data.resultCode === 0) {
      dispatch(SetIsLoggedInAC({isLoggedIn: true}));
    } else {
      handleServerAppError(data, dispatch)
      return rejectWithValue('error')
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(e)
  }
})

const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    errorMessage: null as string | null,
    isInitialized: false
  },
  reducers: {
    SetAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    SetAppErrorMessageAC(state, action: PayloadAction<{ errorMessage: string | null }>) {
      state.errorMessage = action.payload.errorMessage
    },
    setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized
    }
  },
  extraReducers: builder => builder
    .addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true
    })
})

export const appReducer = slice.reducer
export const {SetAppStatusAC, setIsInitializedAC, SetAppErrorMessageAC} = slice.actions

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

