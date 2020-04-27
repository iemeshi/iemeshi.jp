import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from './Home'

function Content() {
  return (
    <HashRouter>
      <Route exact path="/"><Home /></Route>
    </HashRouter>
  );
}

export default Content;
