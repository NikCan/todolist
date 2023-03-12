import React, {ChangeEvent, useCallback} from 'react'
import Checkbox from '@mui/material/Checkbox'
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import {EditableSpan} from 'components'
import {TaskStatuses, TaskType} from "api";

type TaskPropsType = {
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  task: TaskType
  todolistId: string,
  disabled?: boolean
}
export const Task = React.memo(({
                                  changeTaskStatus,
                                  changeTaskTitle,
                                  removeTask,
                                  task,
                                  todolistId,
                                  disabled = false,
                                  ...props
                                }: TaskPropsType) => {

  const onClickHandler = () => removeTask(task.id, todolistId)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    changeTaskStatus(task.id, newIsDoneValue, todolistId)
  }

  const onTitleChangeHandler = useCallback((newValue: string) => {
    changeTaskTitle(task.id, newValue, todolistId)
  }, [task.id, changeTaskTitle, todolistId]);


  return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
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
