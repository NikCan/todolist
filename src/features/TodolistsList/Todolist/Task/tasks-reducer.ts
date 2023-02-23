import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, updateTaskModelType} from "../../../../api/todolists-api";
import {AppRootStateType} from "../../../../app/store";
import {RequestStatusType, SetAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {addTodolistAC, ClearDataAC, removeTodolistAC, setTodolistsAC} from "../../todolists-reducer";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
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
  }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
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
  initialState: initialState,
  reducers: {
    addTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
      state[action.payload.todolistId].unshift(action.payload.task)
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, apiModel: updateTaskModelType, todolistId: string }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId]
        .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.apiModel} : t)
    },
    changeTaskEntityStatusAC(state, action: PayloadAction<{ taskId: string, todolistId: string, entityStatus: RequestStatusType }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId]
        .map(t => t.id === action.payload.taskId ? {...t, entityStatus: action.payload.entityStatus} : t)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolistAC, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolistAC, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(setTodolistsAC, (state, action) => {
        action.payload.todolists.forEach(tl => {
          state[tl.id] = []
        })
      })
      .addCase(ClearDataAC, (state, action) => {
        return {}
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        if (action.payload) state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        if (action.payload) state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id !== action.payload?.taskId)
      })
  }
})
export const tasksReducer = slice.reducer
export const {updateTaskAC, addTaskAC, changeTaskEntityStatusAC} = slice.actions

// thunks

export const createTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  try {
    const data = await todolistAPI.createTask(todolistId, title)
    if (data.resultCode === 0) {
      dispatch(addTaskAC({todolistId, task: data.data.item}))
      dispatch(SetAppStatusAC({status: "succeeded"}))
    } else {
      handleServerAppError<{ item: TaskType }>(data, dispatch)
    }
  } catch (e) {
    if (axios.isAxiosError<{ message: string }>(e)) {
      const error = e.response?.data ? e.response?.data : e
      handleServerNetworkError(error, dispatch)
    }
  }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainModelType, todolistId: string) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
      const apiModel: updateTaskModelType = {
        title: task.title,
        status: task.status,
        startDate: task.startDate,
        deadline: task.deadline,
        priority: task.priority,
        description: task.description,
        ...domainModel
      }
      dispatch(SetAppStatusAC({status: "loading"}))
      dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'loading'}))
      const data = await todolistAPI.updateTask(todolistId, taskId, apiModel)
      try {
        if (data.resultCode === 0) {
          dispatch(updateTaskAC({taskId, apiModel, todolistId}))
          dispatch(SetAppStatusAC({status: "succeeded"}))
          dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'succeeded'}))
        } else {
          handleServerAppError<{ item: TaskType }>(data, dispatch)
        }
      } catch (e) {
        if (axios.isAxiosError<{ message: string }>(e)) {
          const error = e.response?.data ? e.response?.data : e
          handleServerNetworkError(error, dispatch)
        }
      }
    }
  }

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