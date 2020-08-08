//const React = require("react");
//const ReactDOM = require("react-dom");

const App = function () {
  return <div>hello world</div>;
};

const domContainer = document.querySelector("#APP_ROOT");
console.log(domContainer);
ReactDOM.render(<App />, domContainer);
