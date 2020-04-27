import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from './Home'
import Pref from './Pref'

function Content() {
  return (
    <HashRouter>
      <Route exact path="/"><Home /></Route>
      <Route exact path="/:code"><Pref /></Route>
    </HashRouter>
  );
}

export default Content;
