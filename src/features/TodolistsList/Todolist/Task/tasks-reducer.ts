import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
  updateTaskModelType
} from "../../../../api/todolists-api";
import {AppRootStateType} from "../../../../app/store";
import {RequestStatusType, SetAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {addTodolistAC, ClearDataAC, removeTodolistAC, setTodolistsAC} from "../../todolists-reducer";

const initialState: TasksStateType = {}
const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
    },
    addTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
      state[action.payload.todolistId].unshift(action.payload.task)
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, apiModel: updateTaskModelType, todolistId: string }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId]
        .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.apiModel} : t)
    },
    setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
      state[action.payload.todolistId] = action.payload.tasks
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
  }
})
export const tasksReducer = slice.reducer
export const {updateTaskAC, setTasksAC, addTaskAC, changeTaskEntityStatusAC, removeTaskAC} = slice.actions

// thunks
export const FetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  todolistAPI.fetchTasks(todolistId)
    .then((data) => {
      dispatch(setTasksAC({todolistId, tasks: data.items}))
      dispatch(SetAppStatusAC({status: "succeeded"}))
    })
    .catch((e: AxiosError<{ message: string }>) => {
      const error = e.response?.data ? e.response?.data : e
      handleServerNetworkError(error, dispatch)
    })
}
export const RemoveTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'loading'}))
  try {
    const data = await todolistAPI.deleteTask(todolistId, taskId)
    if (data.resultCode === 0) {
      dispatch(removeTaskAC({taskId, todolistId}))
      dispatch(SetAppStatusAC({status: "succeeded"}))
      dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'succeeded'}))
    } else {
      handleServerAppError(data, dispatch)
    }
  } catch (e) {
    if (axios.isAxiosError<{ message: string }>(e)) {
      const error = e.response?.data ? e.response?.data : e
      handleServerNetworkError(error, dispatch)
    }
  }
}
export const CreateTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(SetAppStatusAC({status: "loading"}))
  todolistAPI.createTask(todolistId, title)
    .then((data) => {
      if (data.resultCode === 0) {
        dispatch(addTaskAC({todolistId, task: data.data.item}))
        dispatch(SetAppStatusAC({status: "succeeded"}))
      } else {
        handleServerAppError<{ item: TaskType }>(data, dispatch)
      }
    })
    .catch((e) => {
      handleServerNetworkError(e, dispatch)
    })
}
export const UpdateTaskTC = (taskId: string, domainModel: UpdateDomainModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
      todolistAPI.updateTask(todolistId, taskId, apiModel)
        .then((data) => {
          if (data.resultCode === 0) {
            dispatch(updateTaskAC({taskId, apiModel, todolistId}))
            dispatch(SetAppStatusAC({status: "succeeded"}))
            dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'succeeded'}))
          } else {
            handleServerAppError<{ item: TaskType }>(data, dispatch)
          }
        })
        .catch((e) => {
          handleServerNetworkError(e, dispatch)
        })
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