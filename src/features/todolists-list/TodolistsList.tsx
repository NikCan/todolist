import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "hooks";
import {addTodolistTC, fetchTodolistsTC} from "./todolists-list-reducer";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {AddItemForm} from "components";
import {Navigate} from "react-router-dom";
import {selectTodolists} from "features/todolists-list";
import {selectIsLoggedIn} from "features/auth";
import {Todolist} from "features/todolists-list/Todolist";
import {TodolistDomainType} from "./types";

type PropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
  const todolists = useAppSelector(selectTodolists)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const addTodolist = async (title: string) => {
    const res = await dispatch(addTodolistTC(title))
    if (addTodolistTC.rejected.match(res)) {
      if (res.payload?.errors.length) {
        throw new Error(res.payload?.errors[0])
      } else {
        throw new Error('some error occured')
      }
    }
  }

  useEffect(() => {
    !demo && isLoggedIn && dispatch(fetchTodolistsTC())
  }, [])

  return !isLoggedIn ? <Navigate to={'/login'}/> : <>
    <Grid container style={{padding: "20px"}}>
      <AddItemForm addItem={addTodolist}/>
    </Grid>
    <Grid container style={{flexWrap: 'nowrap', overflowX: 'scroll'}} spacing={3}>
      {
        todolists
          .map((tl: TodolistDomainType) =>
            <Grid item key={tl.id}>
              <Paper style={{width: '280px', padding: "10px"}}>
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
