import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "./EditableSpan";

export default {
    title: 'Example/EditableSpan',
    component: EditableSpan,
    args: {
        value: "example",
        onChange: action("changed")
    }
} as ComponentMeta<typeof EditableSpan>

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanBaseExample = Template.bind({});
EditableSpanBaseExample.args = {};

export const EditableSpanDisabledExample = Template.bind({});
EditableSpanDisabledExample.args = {
    disabled: true
};