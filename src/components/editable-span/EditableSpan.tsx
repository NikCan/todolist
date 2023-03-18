import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

export const EditableSpan = React.memo(function ({value, onChange, disabled = false}: EditableSpanPropsType) {
  let [editMode, setEditMode] = useState(false)
  let [title, setTitle] = useState(value)
  let [error, setError] = useState<string | null>(null)

  const activateEditMode = () => {
    if (!disabled) {
      setEditMode(true)
      setTitle(value)
    }
  }
  const activateViewMode = async () => {
    try {
      await onChange(title)
      setEditMode(false)
    } catch (e: any) {
      setError(e.message)
    }
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    setTitle(e.currentTarget.value)
  }

  return editMode
    ? <TextField value={title} helperText={error} onChange={changeTitle} autoFocus onBlur={activateViewMode}/>
    : <span onDoubleClick={activateEditMode}>{value}</span>
})
