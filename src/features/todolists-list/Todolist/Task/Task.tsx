import React, {ChangeEvent} from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {EditableSpan} from 'components'
import {removeTaskTC, updateTaskTC} from "./tasks-reducer";
import {useAppDispatch} from "hooks";
import {TaskStatuses, TaskType} from "api/types";

type TaskPropsType = {
  task: TaskType
  todolistId: string,
  disabled?: boolean
}
export const Task = React.memo(({task, todolistId, disabled = false}: TaskPropsType) => {
  const dispatch = useAppDispatch()

  const onClickHandler = () => dispatch(removeTaskTC({taskId: task.id, todolistId}))

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(updateTaskTC({taskId: task.id, domainModel: {status: newIsDoneValue}, todolistId}))
  }

  const onTitleChangeHandler = async (newValue: string) => {
    const res = await dispatch(updateTaskTC({taskId: task.id, domainModel: {title: newValue}, todolistId}))
    if (updateTaskTC.rejected.match(res)) {
      if (res.payload?.errors.length) {
        throw new Error(res.payload?.errors[0])
      } else {
        throw new Error('some error occured')
      }
    }
  }

  return <div key={task.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
              className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
    <Checkbox
      checked={task.status === TaskStatuses.Completed}
      color="primary"
      onChange={onChangeHandler}
      disabled={disabled}
    />
    <EditableSpan value={task.title} onChange={onTitleChangeHandler} disabled={disabled}/>
    <IconButton onClick={onClickHandler} disabled={disabled}>
      <Delete/>
    </IconButton>
  </div>
})
