import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

const domContainer = document.querySelector("#APP_ROOT");
console.log(domContainer);
ReactDOM.render(<App />, domContainer);
