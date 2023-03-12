import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "hooks";
import {TaskStatuses} from "api";
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType
} from "./todolists-list-reducer";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {AddItemForm} from "components";
import {Navigate} from "react-router-dom";
import {selectTodolists} from "features/todolists-list";
import {selectIsLoggedIn} from "features/auth";
import {selectTasks, Todolist} from "features/todolists-list/Todolist";
import {addTaskTC, removeTaskTC, updateTaskTC} from "./Todolist/Task/tasks-reducer";

type PropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<PropsType> = ({demo = false, ...props}) => {
  const todolists = useAppSelector(selectTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const removeTask = useCallback((taskId: string, todolistId: string) => {
    dispatch(removeTaskTC({taskId, todolistId}));
  }, [dispatch]);

  const addTask = useCallback((title: string, todolistId: string) => {
    dispatch(addTaskTC({title, todolistId}))
  }, [dispatch])

  const changeTaskStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
    dispatch(updateTaskTC({taskId: id, domainModel: {status}, todolistId}));
  }, [dispatch]);

  const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
    dispatch(updateTaskTC({taskId: id, domainModel: {title: newTitle}, todolistId}));
  }, [dispatch]);

  const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
    dispatch(changeTodolistFilterAC({id: todolistId, filter: value}));
  }, [dispatch]);

  const removeTodolist = useCallback((id: string) => dispatch(removeTodolistTC(id)), [dispatch])

  const changeTodolistTitle = useCallback((id: string, title: string) => {
    dispatch(changeTodolistTitleTC({id, title}))
  }, [dispatch])

  const addTodolist = useCallback((title: string) => dispatch(addTodolistTC(title)), [dispatch])

  useEffect(() => {
    !demo && isLoggedIn && dispatch(fetchTodolistsTC())
  }, [])

  return !isLoggedIn ? <Navigate to={'/login'}/> : <>
    <Grid container style={{padding: "20px"}}>
      <AddItemForm addItem={addTodolist}/>
    </Grid>
    <Grid container spacing={3}>
      {
        todolists
          .map((tl: TodolistDomainType) =>
            <Grid item key={tl.id}>
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
          )
      }
    </Grid>
  </>
}
