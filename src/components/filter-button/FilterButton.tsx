import {FilterValuesType} from "features/todolists-list/todolists-list-reducer";
import Button from "@mui/material/Button";
import React from "react";

type PropsType = {
  onClick: (filter: FilterValuesType) => void
  selectedFilter: FilterValuesType
  filter: FilterValuesType
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined
}
export const FilterButton = ({filter, color, onClick, selectedFilter}: PropsType) => {
  const clickHandler = () => {
    onClick(selectedFilter)
  }
  return <Button
    variant={filter === selectedFilter ? 'outlined' : 'text'}
    onClick={clickHandler}
    color={color}
  >
    {selectedFilter}
  </Button>
}