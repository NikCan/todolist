import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "./Task";
import {TaskPriorities, TaskStatuses, TaskType} from "../../../../api/todolists-api";

export default {
    title: 'Example/Task',
    component: Task,
    args: {
        changeTaskStatus: action("status change"),
        changeTaskTitle: action("title change"),
        removeTask: action('task removed'),
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
            todoListId: 'todolistId'
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
        todoListId: 'todolistId'
    },
};

const Template1: ComponentStory<typeof Task> = () => {
    const [task, setTask] = useState({
        id: "id",
        title: "Story",
        status: TaskStatuses.New,
        order: 2,
        addedDate: '',
        description: 'kjhhgf',
        priority: TaskPriorities.Low,
        deadline: '',
        startDate: '',
        todoListId: 'todolistId'
    })
    const changeTaskStatus = () => setTask({
        ...task,
        status: task.status===TaskStatuses.New ? TaskStatuses.Completed : TaskStatuses.New
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