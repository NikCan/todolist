import {HashRouter} from "react-router-dom";
import React from "react";

export const BrowserRouterDecorator = (storyFn: () => JSX.Element) => {
  return <HashRouter>
    {storyFn()}
  </HashRouter>
}