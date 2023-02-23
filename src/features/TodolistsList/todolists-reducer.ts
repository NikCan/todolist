import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, SetAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTasksTC} from "./Todolist/Task/tasks-reducer";
import {Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []
const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      return action.payload.todolists.map((el) => ({...el, filter: 'all', entityStatus: 'idle'}))
    },
    ClearDataAC(state, action: PayloadAction) {
      return []
    },
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      return state.filter(tl => tl.id !== action.payload.todolistId)
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl);
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl);
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      return state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
    }
  }
})
export const todolistsReducer = slice.reducer
export const {
  setTodolistsAC,
  ClearDataAC,
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC
} = slice.actions

// thunks
export const FetchTodolistsTC = () => (dispatch: ThunkDispatch<AppRootStateType, unknown, any>) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  todolistAPI.getTodolists()
    .then((data) => {
      dispatch(setTodolistsAC({todolists: data}))
      dispatch(SetAppStatusAC({status: "succeeded"}))
      return data
    })
    .then((todolists) => {
      todolists.forEach((tl) => dispatch(fetchTasksTC(tl.id)))
    })
}

export const RemoveTodolistTC = (id: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  dispatch(changeTodolistEntityStatusAC({id, status: 'loading'}))
  todolistAPI.deleteTodolist(id)
    .then((data) => {
      dispatch(removeTodolistAC({todolistId: id}))
      dispatch(SetAppStatusAC({status: "succeeded"}))
      dispatch(changeTodolistEntityStatusAC({id, status: 'succeeded'}))
    })
}
export const AddTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  todolistAPI.createTodolist(title)
    .then((data) => {
      if (data.resultCode === 0) {
        dispatch(addTodolistAC({todolist: data.data.item}))
        dispatch(SetAppStatusAC({status: "succeeded"}))
      } else {
        handleServerAppError<{ item: TodolistType }>(data, dispatch)
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch)
    })
}
export const ChangeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  dispatch(changeTodolistEntityStatusAC({id, status: 'loading'}))
  todolistAPI.updateTodolist(id, title)
    .then((data) => {
      if (data.resultCode === 0) {
        dispatch(changeTodolistTitleAC({id, title}))
        dispatch(SetAppStatusAC({status: "succeeded"}))
        dispatch(changeTodolistEntityStatusAC({id, status: 'succeeded'}))
      } else {
        handleServerAppError(data, dispatch)
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch)
    })
}

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}