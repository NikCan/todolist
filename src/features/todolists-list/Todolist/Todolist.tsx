import React from 'react'
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {AddItemForm, EditableSpan, FilterButton} from 'components'
import {addTaskTC, Task} from 'features/todolists-list/Todolist/Task'
import {TaskStatuses} from "api/types";
import {
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  removeTodolistTC,
} from "../todolists-list-reducer";
import {useAppDispatch, useAppSelector} from "hooks";
import {selectTasks} from "./selectors";
import {FilterValuesType, TodolistDomainType} from '../types';

type PropsType = {
  todolist: TodolistDomainType
  demo?: boolean
}

export const Todolist = React.memo(({todolist, demo = false}: PropsType) => {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector(selectTasks)[todolist.id]

  const addTaskHandler = async (title: string) => {
    const res = await dispatch(addTaskTC({title, todolistId: todolist.id}))
    if (addTaskTC.rejected.match(res)) {
      if (res.payload?.errors.length) {
        throw new Error(res.payload?.errors[0])
      } else {
        throw new Error('some error occured')
      }
    }
  }

  const removeTodolistHandler = () => dispatch(removeTodolistTC(todolist.id))

  const changeTodolistTitleHandler = async (title: string) => {
    const res = await dispatch(changeTodolistTitleTC({id: todolist.id, title}))
    if (changeTodolistTitleTC.rejected.match(res)) {
      if (res.payload?.errors.length) {
        throw new Error(res.payload?.errors[0])
      } else {
        throw new Error('some error occured')
      }
    }
  }

  const onClickHandler = (filter: FilterValuesType) => dispatch(changeTodolistFilterAC({id: todolist.id, filter}))

  let tasksForTodolist = tasks
  if (todolist.filter === 'active') tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  if (todolist.filter === 'completed') tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)

  return <div>
    <h3 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
      <EditableSpan
        value={todolist.title}
        onChange={changeTodolistTitleHandler}
        disabled={todolist.entityStatus === "loading"}
      />
      <IconButton onClick={removeTodolistHandler}
                  disabled={todolist.entityStatus === 'loading'}>
        <Delete/>
      </IconButton>
    </h3>
    <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'}/>
    <div>
      {tasksForTodolist
        .map(t => <Task
          task={t}
          todolistId={todolist.id}
          key={t.id}
          disabled={t.entityStatus === 'loading'}
        />)}
      {tasksForTodolist.length === 0 && <div style={{padding: '10px'}}>no tasks</div>}
    </div>
    <div style={{paddingTop: '10px'}}>
      <FilterButton selectedFilter={'all'} filter={todolist.filter} onClick={onClickHandler} color={'inherit'}/>
      <FilterButton selectedFilter={'active'} filter={todolist.filter} onClick={onClickHandler} color={'primary'}/>
      <FilterButton selectedFilter={'completed'} filter={todolist.filter} onClick={onClickHandler} color={'secondary'}/>
    </div>
  </div>
})
