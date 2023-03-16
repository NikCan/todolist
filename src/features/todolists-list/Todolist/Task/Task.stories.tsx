import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Task} from "./Task";
import {TaskPriorities, TaskStatuses} from "api";
import {ReduxStoreProviderDecorator} from "app/ReduxStoreProviderDecorator";

export default {
  title: 'Example/Task',
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
  args: {
    task: {
      id: 'id',
      title: 'Story',
      status: TaskStatuses.Completed,
      order: 2,
      addedDate: '',
      description: 'kjhhgf',
      priority: TaskPriorities.Low,
      deadline: '',
      startDate: '',
      todoListId: 'todolistId',
      entityStatus: 'idle'
    },
    todolistId: 'todolistId'
  }
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
  task: {
    id: "id",
    title: "Story",
    status: TaskStatuses.New,
    order: 2,
    addedDate: '',
    description: 'kjhhgf',
    priority: TaskPriorities.Low,
    deadline: '',
    startDate: '',
    todoListId: 'todolistId',
    entityStatus: 'idle'
  },
}