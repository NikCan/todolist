import React, {ChangeEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "./Task";
import {TaskType} from "../Todolist/Todolist";

export default {
    title: 'Example/Task',
    component: Task,
    args: {
        changeTaskStatus: action("status change"),
        changeTaskTitle: action("title change"),
        removeTask: action('task removed'),
        task: {id: "id", title: "Story", isDone: true},
        todolistId: "id",
    }
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
    task: {id: "id", title: "Story", isDone: false},
};


const Template1: ComponentStory<typeof Task> = () => {
    const [task, setTask] = useState({id: "id", title: "Story", isDone: false})
    const changeTaskStatus = () => setTask({
        ...task,
        isDone: !task.isDone
    })
    const changeTaskTitle = (taskId: string, newValue: string) => setTask({
        ...task, title: newValue
    })
    const removeTask = () => setTask({} as TaskType)
    return <Task task={task}
                 changeTaskStatus={changeTaskStatus}
                 changeTaskTitle={changeTaskTitle}
                 removeTask={removeTask} todolistId={"id1"}/>;
}
export const TaskStatusChangeExample = Template1.bind({});
TaskStatusChangeExample.args = {};