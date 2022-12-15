import {configureStore} from '@reduxjs/toolkit';
import {
    addTaskActionType,
    changeTaskStatusActionType,
    changeTaskTitleActionType,
    removeTaskActionType, tasksReducer,
} from "./task-reducer";
import {
    AddTodolistActionType, ChangeTodolistFilterActionType,
    ChangeTodolistTitleActionType,
    RemoveTodolistActionType, todolistsReducer,
} from "./todolists-reducer";

export type ActionsType =
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
    | RemoveTodolistActionType
    | AddTodolistActionType
export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
//@ts-ignore
        todolists: todolistsReducer,
//@ts-ignore
        tasks: tasksReducer,
    },
})

//@ts-ignore
window.store = store

