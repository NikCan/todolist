import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: 'idle',
  errorMessage: null,
  isInitialized: false
}
const slice = createSlice({
  name: 'app',
  initialState: initialState,
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
  }
})

export const appReducer = slice.reducer
export const {SetAppStatusAC, setIsInitializedAC, SetAppErrorMessageAC} = slice.actions

// thunks

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  status: RequestStatusType
  errorMessage: null | string
  isInitialized: boolean
}
