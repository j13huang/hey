import * as React from "react";
import * as ReactDOM from "react-dom";

const App = function () {
  return <div>hello world workinggg</div>;
};

const domContainer = document.querySelector("#APP_ROOT");
console.log(domContainer);
ReactDOM.render(<App />, domContainer);
