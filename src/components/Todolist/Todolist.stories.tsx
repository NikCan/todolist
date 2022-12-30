import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Todolist} from "./Todolist";

export default {
    title: 'Example/Todolist',
    component: Todolist,
    args: {
        id: "id",
        title: "todolist",
        tasks: [{id: "tId", title: "Story", isDone: true}, {id: "tId1", title: "Story2", isDone: false}],
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
