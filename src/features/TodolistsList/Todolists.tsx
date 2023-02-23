import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {createTaskTC, removeTaskTC, updateTaskTC} from "./Todolist/Task/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {
  AddTodolistTC,
  changeTodolistFilterAC,
  ChangeTodolistTitleTC,
  FetchTodolistsTC,
  FilterValuesType,
  RemoveTodolistTC,
  TodolistDomainType
} from "./todolists-reducer";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";

type PropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<PropsType> = ({demo = false, ...props}) => {
  const todolists = useAppSelector(state => state.todolists)
  const tasks = useAppSelector(state => state.tasks)
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    dispatch(removeTaskTC({taskId, todolistId}));
  }, [dispatch]);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(createTaskTC(title, todolistId));
  }, [dispatch]);

  const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    dispatch(updateTaskTC(id, {status}, todolistId));
  }, [dispatch]);

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    dispatch(updateTaskTC(id, {title: newTitle}, todolistId));
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
            </Paper>
          </Grid>
        })
      }
    </Grid>
  </>
}
