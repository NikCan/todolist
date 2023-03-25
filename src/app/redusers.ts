import {combineReducers} from "redux";
import {tasksReducer} from "../features/todolists-list/Todolist/Task";
import {todolistsReducer} from "../features/todolists-list";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/auth";

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer
})