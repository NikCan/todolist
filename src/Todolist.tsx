import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export type TaskType = {
    taskId: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    todolistId: number
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: number) => void
    changeFilter: (value: FilterValuesType, todolistId: number) => void
    addTask: (title: string, todolistId: number) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: number) => void
    removeTodolist: (id: number) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: number) => void
    changeTodolistTitle: (newTitle: string, todolistId: number) => void
}

export function Todolist(props: TodolistPropsType) {
    const removeTodolist = () => props.removeTodolist(props.todolistId)
    const onAllClickHandler = () => props.changeFilter("all", props.todolistId);
    const onActiveClickHandler = () => props.changeFilter("active", props.todolistId);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.todolistId);
    const addTask = (title: string) => {
        props.addTask(title, props.todolistId)
    }
    const onChangeTitleTodoHandler = (newTitle: string) => {
        props.changeTodolistTitle(newTitle, props.todolistId)
    }

    return <div>
        <h3> {<EditableSpan title={props.title} onChange={onChangeTitleTodoHandler}/>}
            <IconButton onClick={removeTodolist} aria-label="delete">
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.taskId, props.todolistId)
                    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.taskId, newIsDoneValue, props.todolistId);
                    }
                    const onChangeTitleHandler = (newTitle: string) => {
                        props.changeTaskTitle(t.taskId, newTitle, props.todolistId)
                    }
                    const label = {inputProps: {'aria-label': 'Checkbox demo'}};
                    return <div key={t.taskId} className={t.isDone ? "is-done" : ""}>
                        <Checkbox {...label} defaultChecked
                                  onChange={onChangeStatusHandler} checked={t.isDone}/>
                        <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                        <IconButton onClick={onClickHandler} aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button color="success" variant={props.filter === 'all' ? "outlined" : "text"}
                    onClick={onAllClickHandler}>All
            </Button>
            <Button variant={props.filter === 'active' ? "outlined" : "text"}
                    onClick={onActiveClickHandler}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? "outlined" : "text"}
                    onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
}

