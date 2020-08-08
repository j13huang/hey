//const React = require("react");
//const ReactDOM = require("react-dom");

var App = function App() {
  return React.createElement(
    "div",
    null,
    "hello world"
  );
};

var domContainer = document.querySelector("#APP_ROOT");
console.log(domContainer);
ReactDOM.render(React.createElement(App, null), domContainer);