import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import TextField from '@mui/material/TextField/TextField';
import {IconButton} from "@mui/material";
import {AddBox} from "@mui/icons-material";

type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm = React.memo(({disabled = false, addItem}: AddItemFormPropsType) => {
  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const addItemHandler = async () => {
    if (title.trim() !== "") {
      try {
        await addItem(title)
        setTitle("")
      } catch (e: any) {
        setError(e.message)
      }
    } else {
      setError("Title is required");
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.code === "Enter") {
      addItemHandler()
    }
  }

  return <div style={{display: 'flex', justifyContent: 'space-between'}}>
    <TextField
      variant="outlined"
      error={!!error}
      value={title}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
      label="Title"
      helperText={error}
      disabled={disabled}
    />
    <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
      <AddBox/>
    </IconButton>
  </div>
});
