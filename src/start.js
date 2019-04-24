import React from "react";
import ReactDOM from "react-dom";
import Registration from "./registration";

let elem;

if (location.pathname == "/welcome") {
    // console.log(location.pathname);
    elem = <Registration />;
} else {
    elem = <h1>Under Construction</h1>;
}

//react components, constructors and classes start with first capital letter!
ReactDOM.render(elem, document.querySelector("main"));

// function First() {
//     return <div>Hello, World!</div>;
// }
