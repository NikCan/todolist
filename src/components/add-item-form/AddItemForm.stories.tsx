import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {AddItemForm} from "./AddItemForm";
import {action} from "@storybook/addon-actions";

export default {
  title: 'Example/add-item-form',
  component: AddItemForm,
  argTypes: {
    addItem: { description: 'button click' },
  },
} as ComponentMeta<typeof AddItemForm>

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormBaseExample = Template.bind({});
AddItemFormBaseExample.args = {
  addItem: action("add item"),
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormDisabledExample.args = {
  disabled: true
};