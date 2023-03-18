import {TaskPriorities, TaskStatuses, TaskType} from "api/types";

export type UpdateDomainModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}