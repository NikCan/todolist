import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, updateTaskModelType} from "api/todolists-api";
import {AppRootStateType} from "app/store";
import {RequestStatusType, SetAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistTC, ClearDataAC, fetchTodolistsTC, removeTodolistTC} from "../../todolists-reducer";

export const fetchTasksTC = createAsyncThunk(
  'tasks/fetchTasks',
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(SetAppStatusAC({status: "loading"}))
    try {
      const data = await todolistAPI.fetchTasks(todolistId)
      thunkAPI.dispatch(SetAppStatusAC({status: "succeeded"}))
      return {todolistId, tasks: data.items}
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, thunkAPI.dispatch)
      }
      return thunkAPI.rejectWithValue(e)
    }
  })

export const addTaskTC = createAsyncThunk(
  'tasks/addTasks',
  async (param: { title: string, todolistId: string }, {dispatch, rejectWithValue}) => {
    dispatch(SetAppStatusAC({status: "loading"}))
    try {
      const data = await todolistAPI.createTask(param.todolistId, param.title)
      if (data.resultCode === 0) {
        dispatch(SetAppStatusAC({status: "succeeded"}))
        return {todolistId: param.todolistId, task: data.data.item}
      } else {
        handleServerAppError<{ item: TaskType }>(data, dispatch)
        return rejectWithValue('error')
      }
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error)
      }
    }
  })

export const updateTaskTC = createAsyncThunk(
  'tasks/updateTasks',
  async (param: { taskId: string, domainModel: UpdateDomainModelType, todolistId: string }, {
    dispatch, rejectWithValue, getState
  }) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
    if (task) {
      const apiModel: updateTaskModelType = {
        title: task.title,
        status: task.status,
        startDate: task.startDate,
        deadline: task.deadline,
        priority: task.priority,
        description: task.description,
        ...param.domainModel
      }
      dispatch(SetAppStatusAC({status: "loading"}))
      dispatch(changeTaskEntityStatusAC({taskId: param.taskId, todolistId: param.todolistId, entityStatus: 'loading'}))
      const data = await todolistAPI.updateTask(param.todolistId, param.taskId, apiModel)
      try {
        if (data.resultCode === 0) {
          dispatch(SetAppStatusAC({status: "succeeded"}))
          dispatch(changeTaskEntityStatusAC({
            taskId: param.taskId,
            todolistId: param.todolistId,
            entityStatus: 'succeeded'
          }))
          return {taskId: param.taskId, apiModel, todolistId: param.todolistId}
        } else {
          handleServerAppError<{ item: TaskType }>(data, dispatch)
          return rejectWithValue('error')
        }
      } catch (e) {
        if (axios.isAxiosError<{ message: string }>(e)) {
          const error = e.response?.data ? e.response?.data : e
          handleServerNetworkError(error, dispatch)
          return rejectWithValue(e)
        }
      }
    }
    return rejectWithValue('error')
  }
)
export const removeTaskTC = createAsyncThunk(
  'tasks/removeTask',
  async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    thunkAPI.dispatch(SetAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(changeTaskEntityStatusAC({...param, entityStatus: 'loading'}))
    try {
      const data = await todolistAPI.deleteTask(param.todolistId, param.taskId)
      if (data.resultCode === 0) {
        thunkAPI.dispatch(SetAppStatusAC({status: "succeeded"}))
        thunkAPI.dispatch(changeTaskEntityStatusAC({...param, entityStatus: 'succeeded'}))
        return {...param}
      } else {
        handleServerAppError(data, thunkAPI.dispatch)
      }
    } catch (e) {
      if (axios.isAxiosError<{ message: string }>(e)) {
        const error = e.response?.data ? e.response?.data : e
        handleServerNetworkError(error, thunkAPI.dispatch)
      }
    }
  })

const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksStateType,
  reducers: {
    changeTaskEntityStatusAC(state, action: PayloadAction<{ taskId: string, todolistId: string, entityStatus: RequestStatusType }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId]
        .map(t => t.id === action.payload.taskId ? {...t, entityStatus: action.payload.entityStatus} : t)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach(tl => state[tl.id] = [])
      })
      .addCase(ClearDataAC, () => {
        return {}
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        if (action.payload) state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        if (action.payload) state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id !== action.payload?.taskId)
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        if (action.payload) state[action.payload.todolistId].unshift(action.payload.task)
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = state[action.payload.todolistId]
          .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.apiModel} : t)
      })
  }
})
export const tasksReducer = slice.reducer
export const {changeTaskEntityStatusAC} = slice.actions

// types
type UpdateDomainModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}