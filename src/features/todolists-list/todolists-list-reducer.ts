import {todolistAPI} from "api";
import {TodolistType} from "api/types";
import {RequestStatusType} from "app/types";
import {handleServerAppError, handleServerNetworkError} from "utils";
import {fetchTasksTC} from "./Todolist/Task";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ThunkError} from "app/store";
import {FilterValuesType, TodolistDomainType} from "./types";

export const fetchTodolistsTC = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>(
  'todolists/fetchTodolists',
  async (param, {dispatch, rejectWithValue}) => {
    const todolists = await todolistAPI.getTodolists()
    try {
      todolists.forEach((tl) => dispatch(fetchTasksTC(tl.id)))
      return {todolists}
    } catch (e) {
      return handleServerNetworkError(e, dispatch, rejectWithValue)
    }
  })

export const removeTodolistTC = createAsyncThunk<{ todolistId: string }, string, ThunkError>(
  'todolists/removeTodolists',
  async (id, {dispatch, rejectWithValue}) => {
    dispatch(todolistsActions.changeTodolistEntityStatusAC({id, status: 'loading'}))
    try {
      await todolistAPI.deleteTodolist(id)
      dispatch(todolistsActions.changeTodolistEntityStatusAC({id, status: 'succeeded'}))
      return {todolistId: id}
    } catch (e) {
      return handleServerNetworkError(e, dispatch, rejectWithValue)
    }
  })

export const addTodolistTC = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>(
  'todolists/addTodolist',
  async (title, {dispatch, rejectWithValue}) => {
    try {
      const data = await todolistAPI.createTodolist(title)
      if (data.resultCode === 0) {
        return {todolist: data.data.item}
      } else {
        return handleServerAppError<{ item: TodolistType }>(data, dispatch, rejectWithValue, false)
      }
    } catch (e: any) {
      return handleServerNetworkError(e, dispatch, rejectWithValue, false)
    }
  }
)

export const changeTodolistTitleTC = createAsyncThunk<{ id: string, title: string }, { id: string, title: string },
  ThunkError
>(
  'todolists/changeTodolistTitle',
  async (params, {dispatch, rejectWithValue}) => {
    dispatch(todolistsActions.changeTodolistEntityStatusAC({id: params.id, status: 'loading'}))
    try {
      const data = await todolistAPI.updateTodolist(params.id, params.title)
      if (data.resultCode === 0) {
        dispatch(todolistsActions.changeTodolistEntityStatusAC({id: params.id, status: 'succeeded'}))
        return {id: params.id, title: params.title}
      } else {
        return handleServerAppError(data, dispatch, rejectWithValue, false)
      }
    } catch (e: any) {
      return handleServerNetworkError(e, dispatch, rejectWithValue, false)
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
export const {reducer: todolistsReducer, actions: todolistsActions} = slice
