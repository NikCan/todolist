import React, {useCallback} from 'react'
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {EditableSpan, AddItemForm} from 'components'
import {Task} from 'features/TodolistsList/Todolist/Task'
import {TaskStatuses, TaskType} from "api";
import {FilterValuesType, TodolistDomainType} from "../todolists-list-reducer";

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  removeTodolist: (id: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  demo?: boolean
}

export const Todolist = React.memo(({
                                      todolist,
                                      tasks,
                                      changeFilter,
                                      addTask,
                                      changeTaskStatus,
                                      changeTaskTitle,
                                      removeTask,
                                      removeTodolist,
                                      changeTodolistTitle,
                                      demo = false,
                                      ...props
                                    }: PropsType) => {

  const addTaskHandler = useCallback((title: string) => addTask(title, todolist.id), [addTask, todolist.id])

  const removeTodolistHandler = () => removeTodolist(todolist.id)

  const changeTodolistTitleHandler = useCallback((title: string) => {
    changeTodolistTitle(todolist.id, title)
  }, [todolist.id, changeTodolistTitle])

  const onAllClickHandler = useCallback(() => changeFilter('all', todolist.id), [changeFilter, todolist.id])

  const onActiveClickHandler = useCallback(() => changeFilter('active', todolist.id), [changeFilter, todolist.id])

  const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolist.id), [changeFilter, todolist.id])

  let tasksForTodolist = tasks
  if (todolist.filter === 'active') tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  if (todolist.filter === 'completed') tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)

  return <div>
    <h3><EditableSpan
      value={todolist.title}
      onChange={changeTodolistTitleHandler}
      disabled={todolist.entityStatus === "loading"}
    />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
        <Delete/>
      </IconButton>
    </h3>
    <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === 'loading'}/>
    <div>
      {
        tasksForTodolist
          .map(t => <Task
            task={t}
            changeTaskStatus={changeTaskStatus}
            changeTaskTitle={changeTaskTitle}
            removeTask={removeTask}
            todolistId={todolist.id}
            key={t.id}
            disabled={t.entityStatus === 'loading'}
          />)
      }
    </div>
    <div style={{paddingTop: '10px'}}>
      <Button
        variant={todolist.filter === 'all' ? 'outlined' : 'text'}
        onClick={onAllClickHandler}
        color={'inherit'}
      >All
      </Button>
      <Button
        variant={todolist.filter === 'active' ? 'outlined' : 'text'}
        onClick={onActiveClickHandler}
        color={'primary'}>Active
      </Button>
      <Button
        variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
        onClick={onCompletedClickHandler}
        color={'secondary'}>Completed
      </Button>
    </div>
  </div>
})


