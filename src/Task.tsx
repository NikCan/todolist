import React, {ChangeEvent} from 'react';
import {EditableSpan} from './EditableSpan';
import {Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    task: TaskType
    removeTask: (taskId: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    changeTaskTitle: (taskId: string, newTitle: string) => void
}

export const Task = React.memo ((props: PropsType) => {
    console.log("task")

        const onClickHandler = () => props.removeTask(props.task.id)
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(props.task.id, newIsDoneValue);
        }
        const onTitleChangeHandler = (newValue: string) => {
            props.changeTaskTitle(props.task.id, newValue);
        }


        return <div className={props.task.isDone ? "is-done" : ""}>
            <Checkbox
                checked={props.task.isDone}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
})


