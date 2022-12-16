import {configureStore} from '@reduxjs/toolkit';
import {
    AddTodolistActionType, ChangeTodolistFilterActionType,
    ChangeTodolistTitleActionType,
    RemoveTodolistActionType,
    todolistsReducer
} from "./todolists-reducer";
import {
    addTaskActionType,
    changeTaskStatusActionType,
    changeTaskTitleActionType,
    removeTaskActionType,
    tasksReducer
} from "./task-reducer";


export type ActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
//@ts-ignore
        todolists: todolistsReducer,
//@ts-ignore
        tasks: tasksReducer,
    },
});

//@ts-ignore
window.store = store

