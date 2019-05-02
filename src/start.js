import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
//import from export-default. no curly bracket needed
let elem;

if (location.pathname == "/welcome") {
    // console.log(location.pathname);
    elem = <Welcome />;
} else {
    // if (location.pathname != "/") {
    //     window.history.pushState({}, null, "/");
    // } //a browser way to change url without reloading. To handle user input of random strings 8082/hfjkdhjfkds
    elem = <App />;
}

//react components, constructors and classes start with first capital letter!
ReactDOM.render(elem, document.querySelector("main"));
