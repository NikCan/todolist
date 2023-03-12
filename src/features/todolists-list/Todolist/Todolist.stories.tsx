import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Todolist} from "./Todolist";
import {TaskPriorities, TaskStatuses} from "../../../api/todolists-api";

export default {
    title: 'Example/todolists-list',
    component: Todolist,
    args: {
        id: "id",
        title: "todolist",
        tasks: [
            {
                id: "tId",
                title: "Story",
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
            {
                id: "tId1",
                title: "Story2",
                status: TaskStatuses.New,
                order: 2,
                addedDate: '',
                description: 'kjhhgf',
                priority: TaskPriorities.Low,
                deadline: '',
                startDate: '',
                todoListId: 'todolistId',
                entityStatus: 'idle'
            }
        ],
        changeFilter: action("changeFilter"),
        addTask: action("addTask"),
        changeTaskStatus: action("changeTaskStatus"),
        changeTaskTitle: action("changeTaskTitle"),
        removeTask: action("removeTask"),
        removeTodolist: action("removeTodolist"),
        changeTodolistTitle: action("changeTodolistTitle"),
        filter: "all",
    }
} as ComponentMeta<typeof Todolist>

const Template: ComponentStory<typeof Todolist> = (args) => <Todolist {...args} />;

export const TodolistExample = Template.bind({});
TodolistExample.args = {};
