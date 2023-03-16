import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "hooks";
import {addTodolistTC, fetchTodolistsTC, TodolistDomainType} from "./todolists-list-reducer";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {AddItemForm} from "components";
import {Navigate} from "react-router-dom";
import {selectTodolists} from "features/todolists-list";
import {selectIsLoggedIn} from "features/auth";
import {Todolist} from "features/todolists-list/Todolist";

type PropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const todolists = useAppSelector(selectTodolists)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

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
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
      }
    </Grid>
  </>
}
