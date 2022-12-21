import React, {ChangeEvent} from 'react';
import {EditableSpan} from './EditableSpan';
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    task: TaskType
    todolistId: string
}

export const TaskWithRedux = React.memo(({task, todolistId}: PropsType) => {
    console.log("taskRedux")
    const {id, title, isDone} = task
    const dispatch = useDispatch()

    const onClickHandler = () => {
        dispatch(removeTaskAC(id, todolistId))
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(id, e.currentTarget.checked, todolistId))
    }
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(id, newValue, todolistId))
    }


    return <div className={isDone ? "is-done" : ""}>
        <Checkbox
            checked={isDone}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})


