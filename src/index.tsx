import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './app/App';
import {store} from './app/store';
import {Provider} from 'react-redux';
import {BrowserRouter} from "react-router-dom";

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container);
root.render(
        <Provider store={store}>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
