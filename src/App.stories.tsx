import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import App from "./App";
import {ReduxStoreProviderDecorator} from "./state/ReduxStoreProviderDecorator";

export default {
    title: 'Example/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>

const Template: ComponentStory<typeof App> = () => <App/>

export const AppWithReduxExample = Template.bind({});

