import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../AddItemForm/AddItemForm'
import {EditableSpan} from '../EditableSpan/EditableSpan'

import {Task} from '../Task/Task'
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../api/todolists-api";
import {FilterValuesType} from "../../state/todolists-reducer";
import {AppDispatch} from "../../state/store";
import {FetchTasksTC} from "../../state/tasks-reducer";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist = React.memo(({
                                        id,
                                        title,
                                        tasks,
                                        changeFilter,
                                        addTask,
                                        changeTaskStatus,
                                        changeTaskTitle,
                                        removeTask,
                                        removeTodolist,
                                        changeTodolistTitle,
                                        filter,
                                        ...props
                                    }: PropsType) => {
    const dispatch = AppDispatch()
    useEffect(() => {
        dispatch(FetchTasksTC(id))
    }, [])
    const addTaskHandler = useCallback((title: string) => {
        addTask(title, id)
    }, [addTask, id])

    const removeTodolistHandler = () => removeTodolist(id)
    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle(id, title)
    }, [id, changeTodolistTitle])

    const onAllClickHandler = useCallback(() => {
        changeFilter('all', id)
    }, [changeFilter, id])
    const onActiveClickHandler = useCallback(() => {
        changeFilter('active', id)
    }, [changeFilter, id])
    const onCompletedClickHandler = useCallback(() => {
        changeFilter('completed', id)
    }, [changeFilter, id])

    let tasksForTodolist = tasks
    if (filter === 'active') tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)

    if (filter === 'completed') tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)


    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskHandler}/>
        <div>
            {
                tasksForTodolist.map(t => <Task
                    task={t}
                    changeTaskStatus={changeTaskStatus}
                    changeTaskTitle={changeTaskTitle}
                    removeTask={removeTask}
                    todolistId={id}
                    key={t.id}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


