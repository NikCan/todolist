import {TaskType, updateTaskModelType} from "api/types";
import {todolistAPI} from "api";
import {AppRootStateType, ThunkError} from "app/store";
import {RequestStatusType} from "app/types";
import {handleServerAppError, handleServerNetworkError} from "utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistTC, ClearDataAC, fetchTodolistsTC, removeTodolistTC} from "features/todolists-list";
import {TasksStateType, UpdateDomainModelType} from "./types";

export const fetchTasksTC = createAsyncThunk<{ todolistId: string, tasks: TaskType[] }, string, ThunkError>(
  'tasks/fetchTasks',
  async (todolistId, thunkAPI) => {
    try {
      const data = await todolistAPI.fetchTasks(todolistId)
      return {todolistId, tasks: data.items}
    } catch (e) {
      return handleServerNetworkError(e, thunkAPI.dispatch, thunkAPI.rejectWithValue)
    }
  })

export const addTaskTC = createAsyncThunk<{ todolistId: string, task: TaskType },
  { title: string, todolistId: string }, ThunkError
>(
  'tasks/addTasks',
  async (param, {dispatch, rejectWithValue}) => {
    try {
      const data = await todolistAPI.createTask(param.todolistId, param.title)
      if (data.resultCode === 0) {
        return {todolistId: param.todolistId, task: data.data.item}
      } else {
        return handleServerAppError<{ item: TaskType }>(data, dispatch, rejectWithValue, false)
      }
    } catch (e) {
      return handleServerNetworkError(e, dispatch, rejectWithValue, false)
    }
  })

export const updateTaskTC = createAsyncThunk<{ taskId: string, apiModel: updateTaskModelType, todolistId: string },
  { taskId: string, domainModel: UpdateDomainModelType, todolistId: string },
  ThunkError
>(
  'tasks/updateTasks',
  async (param, {
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
      dispatch(changeTaskEntityStatusAC({taskId: param.taskId, todolistId: param.todolistId, entityStatus: 'loading'}))
      const data = await todolistAPI.updateTask(param.todolistId, param.taskId, apiModel)
      try {
        if (data.resultCode === 0) {
          dispatch(changeTaskEntityStatusAC({
            taskId: param.taskId,
            todolistId: param.todolistId,
            entityStatus: 'succeeded'
          }))
          return {taskId: param.taskId, apiModel, todolistId: param.todolistId}
        } else {
          return handleServerAppError<{ item: TaskType }>(data, dispatch, rejectWithValue, false)
        }
      } catch (e) {
        handleServerNetworkError(e, dispatch, rejectWithValue, false)
      }
    }
    return rejectWithValue({errors: ['unknown error'], fieldsErrors: undefined})
  }
)
export const removeTaskTC = createAsyncThunk<{ taskId: string, todolistId: string },
  { taskId: string, todolistId: string }, ThunkError
>(
  'tasks/removeTask',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(changeTaskEntityStatusAC({...param, entityStatus: 'loading'}))
    try {
      const data = await todolistAPI.deleteTask(param.todolistId, param.taskId)
      if (data.resultCode === 0) {
        thunkAPI.dispatch(changeTaskEntityStatusAC({...param, entityStatus: 'succeeded'}))
        return {...param}
      } else {
        return handleServerAppError(data, thunkAPI.dispatch, thunkAPI.rejectWithValue)
      }
    } catch (e) {
      return handleServerNetworkError(e, thunkAPI.dispatch, thunkAPI.rejectWithValue)
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
