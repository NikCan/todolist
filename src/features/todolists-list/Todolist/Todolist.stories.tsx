import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Todolist} from "./Todolist";
import {ReduxStoreProviderDecorator} from "app/ReduxStoreProviderDecorator";

export default {
  title: 'Example/todolist',
  component: Todolist,
  decorators: [ReduxStoreProviderDecorator],
  args: {
    todolist: {id: 'todolistId1', title: 'What to learn', filter: 'all', entityStatus: 'idle', order: 1, addedDate: ''},
  }
} as ComponentMeta<typeof Todolist>

const Template: ComponentStory<typeof Todolist> = (args) => <Todolist demo={true} {...args} />;

export const TodolistExample = Template.bind({});
