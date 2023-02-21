import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {CreateTaskTC, RemoveTaskTC, UpdateTaskTC} from "./Todolist/Task/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {
    AddTodolistTC,
    changeTodolistFilterAC,
    ChangeTodolistTitleTC,
    FilterValuesType,
    RemoveTodolistTC, FetchTodolistsTC, TodolistDomainType
} from "./todolists-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import SchoolIcon from '@mui/icons-material/School';

type PropsType = {
    demo?: boolean
}
export const TodolistsList: React.FC<PropsType> = ({demo = false, ...props}) => {
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(RemoveTaskTC(id, todolistId));
    }, [dispatch]);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(CreateTaskTC(title, todolistId));
    }, [dispatch]);

    const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(UpdateTaskTC(id, {status}, todolistId));
    }, [dispatch]);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(UpdateTaskTC(id, {title: newTitle}, todolistId));
    }, [dispatch]);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC({id: todolistId, filter: value}));
    }, [dispatch]);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(RemoveTodolistTC(id));
    }, [dispatch]);

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(ChangeTodolistTitleTC(id, title));
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(AddTodolistTC(title));
    }, [dispatch]);

    useEffect(() => {
        !demo && isLoggedIn && dispatch(FetchTodolistsTC())
    }, [])

    return !isLoggedIn ? <Navigate to={'/login'}/> : <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map((tl: TodolistDomainType) => {
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: "10px"}}>
                            <Todolist
                                todolist={tl}
                                tasks={tasks[tl.id]}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeTaskStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                            <SchoolIcon/>
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
