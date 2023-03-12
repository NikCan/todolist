import {todolistAPI, TodolistType} from "api";
import {RequestStatusType, SetAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils";
import {fetchTasksTC} from "./Todolist/Task/tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodolistsTC = createAsyncThunk(
  'todolists/fetchTodolists',
  async (param, {dispatch, rejectWithValue}) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    const todolists = await todolistAPI.getTodolists()
    try {
      dispatch(SetAppStatusAC({status: "succeeded"}))
      todolists.forEach((tl) => dispatch(fetchTasksTC(tl.id)))
      return {todolists}
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, dispatch)
      }
      return rejectWithValue(e)
    }
  })

export const removeTodolistTC = createAsyncThunk(
  'todolists/removeTodolists',
  async (id: string, {dispatch, rejectWithValue}) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({id, status: 'loading'}))
    try {
      await todolistAPI.deleteTodolist(id)
      dispatch(SetAppStatusAC({status: "succeeded"}))
      dispatch(changeTodolistEntityStatusAC({id, status: 'succeeded'}))
      return {todolistId: id}
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, dispatch)
      }
      return rejectWithValue(e)
    }
  })

export const addTodolistTC = createAsyncThunk(
  'todolists/addTodolist',
  async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    try {
      const data = await todolistAPI.createTodolist(title)
      if (data.resultCode === 0) {
        dispatch(SetAppStatusAC({status: "succeeded"}))
        return {todolist: data.data.item}
      } else {
        handleServerAppError<{ item: TodolistType }>(data, dispatch)
        return rejectWithValue('error')
      }
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, dispatch)
      }
      return rejectWithValue(e)
    }
  }
)

export const changeTodolistTitleTC = createAsyncThunk(
  'todolists/changeTodolistTitle',
  async (params: { id: string, title: string }, {dispatch, rejectWithValue}) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({id: params.id, status: 'loading'}))
    try {
      const data = await todolistAPI.updateTodolist(params.id, params.title)
      if (data.resultCode === 0) {
        dispatch(SetAppStatusAC({status: "succeeded"}))
        dispatch(changeTodolistEntityStatusAC({id: params.id, status: 'succeeded'}))
        return {id: params.id, title: params.title}
      } else {
        handleServerAppError(data, dispatch)
        return rejectWithValue('error')
      }
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, dispatch)
      }
      return rejectWithValue(e)
    }
  }
)

const slice = createSlice({
  name: 'todolists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    ClearDataAC() {
      return []
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl);
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      return state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
    }
  },
  extraReducers: builder => builder
    .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((el) => ({...el, filter: 'all', entityStatus: 'idle'}))
    })
    .addCase(removeTodolistTC.fulfilled, (state, action) => {
      return state.filter(tl => tl.id !== action.payload.todolistId)
    })
    .addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
    })
    .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl);
    })
})
export const todolistsReducer = slice.reducer
export const {ClearDataAC, changeTodolistFilterAC, changeTodolistEntityStatusAC} = slice.actions

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}