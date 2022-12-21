import React, {useCallback} from 'react';
import {FilterValuesType, TasksStateType} from './AppWithRedux';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TaskWithRedux} from "./TaskWithRedux";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist = React.memo((props: PropsType) => {
    console.log("todo")
    const tasks = useSelector<AppRootStateType,TaskType[]>(state => state.tasks[props.id])

    let tasksForTodolist = tasks
    if (props.filter === "active") {
        tasksForTodolist = tasks.filter(t => t.isDone === false);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone === true);
    }

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id])


    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    }

    const onAllClickHandler = useCallback (() => props.changeFilter("all", props.id), [props.changeFilter])
    const onActiveClickHandler = useCallback (() => props.changeFilter("active", props.id), [props.changeFilter])
    const onCompletedClickHandler = useCallback (() => props.changeFilter("completed", props.id), [props.changeFilter])

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodolist.map(t => <TaskWithRedux
                    key={t.id}
                    task={t}
                    todolistId={props.id}
                />)
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonMemo variant={props.filter === 'all' ? 'outlined' : 'text'}
                        onClick={onAllClickHandler}
                        color={'inherit'}
                        title={"All"}/>
            <ButtonMemo variant={props.filter === 'active' ? 'outlined' : 'text'}
                        onClick={onActiveClickHandler}
                        color={'primary'}
                        title={"Active"}/>
            <ButtonMemo variant={props.filter === 'completed' ? 'outlined' : 'text'}
                        onClick={onCompletedClickHandler}
                        color={'secondary'}
                        title={"Completed"}/>
        </div>
    </div>
})

type ButtonMemoPropsType = {
    title: string
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    variant: 'text' | 'outlined' | 'contained'
    onClick: () => void
}
const ButtonMemo = React.memo((props: ButtonMemoPropsType) => {

    return <Button
        variant={props.variant}
        onClick={props.onClick}
        color={props.color}
    >{props.title}
    </Button>
})