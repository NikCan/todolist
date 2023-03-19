import {createAsyncThunk, createSlice, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC} from "features/todolists-list";
import {loginTC, logoutTC} from "features/auth";
import {addTaskTC, fetchTasksTC, removeTaskTC, updateTaskTC} from "features/todolists-list/Todolist/Task";
import {RequestStatusType} from "./types";
import {FieldErrorType} from "../api/types";

export const initializeApp = createAsyncThunk<undefined, undefined,
  { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
>(
  'app/initializeApp',
  async (param, {dispatch, rejectWithValue}) => {
    try {
      const data = await authAPI.me()
      if (data.resultCode !== 0) {
        return handleServerAppError(data, dispatch, rejectWithValue)
      }
    } catch (e: any) {
      handleServerNetworkError(e, dispatch, rejectWithValue)
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
  },
  extraReducers: builder => builder
    .addCase(initializeApp.fulfilled, (state) => {
      state.isInitialized = true
    })
    .addCase(initializeApp.rejected, (state) => {
      state.isInitialized = true
    })
    .addMatcher(isAnyOf(changeTodolistTitleTC.pending, addTodolistTC.pending, removeTodolistTC.pending,
      fetchTodolistsTC.pending, loginTC.pending, logoutTC.pending, fetchTasksTC.pending, addTaskTC.pending,
      updateTaskTC.pending, removeTaskTC.pending), state => {
      state.status = 'loading'
    })
    .addMatcher(isAnyOf(changeTodolistTitleTC.fulfilled, addTodolistTC.fulfilled, removeTodolistTC.fulfilled,
      fetchTodolistsTC.fulfilled, loginTC.fulfilled, logoutTC.fulfilled, fetchTasksTC.fulfilled, addTaskTC.fulfilled,
      updateTaskTC.fulfilled, removeTaskTC.fulfilled), state => {
      state.status = 'succeeded'
    })
})

// export const appReducer = slice.reducer
// export const {SetAppStatusAC, SetAppErrorMessageAC} = slice.actions
export const {reducer: appReducer, actions: appActions } = slice
