import React, {memo, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {Task} from "./Task";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    todolistId: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist = memo((props: PropsType) => {
    console.log(parseInt(props.todolistId, 36))
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolistId])
    const dispatch = useDispatch();
    let tasksForTodolist = props.filter === "active" ? tasks.filter(t => !t.isDone)
        : props.filter === "completed" ? tasks.filter(t => t.isDone)
            : tasks;

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.todolistId))
    }, [dispatch, props.todolistId])
    const removeTodolist = () => props.removeTodolist(props.todolistId)
    const changeTodolistTitle = useCallback ((title: string) => {
        props.changeTodolistTitle(props.todolistId, title);
    }, [props.changeTodolistTitle, props.todolistId])

    const removeTask = useCallback((id: string) => {
        dispatch(removeTaskAC(id, props.todolistId));
    }, [dispatch, props.todolistId])
    const changeTaskStatus = useCallback((id: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(id, isDone, props.todolistId));
    }, [dispatch, props.todolistId])
    const changeTaskTitle = useCallback((id: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(id, newTitle, props.todolistId));
    }, [dispatch, props.todolistId])

    const onAllClickHandler = () => props.changeFilter("all", props.todolistId);
    const onActiveClickHandler = () => props.changeFilter("active", props.todolistId);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.todolistId);

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {tasksForTodolist.map(t => <Task
                key={t.id}
                task={t}
                changeTaskTitle={changeTaskTitle}
                changeTaskStatus={changeTaskStatus}
                removeTask={removeTask}
            />)}
        </div>
        <div style={{paddingTop: "10px"}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})

