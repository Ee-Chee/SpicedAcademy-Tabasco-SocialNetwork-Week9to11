import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
//import from export-default. no curly bracket needed
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

if (location.pathname == "/welcome") {
    // console.log(location.pathname);
    elem = <Welcome />;
} else {
    // if (location.pathname != "/") {
    //     window.history.pushState({}, null, "/");
    // } //a browser way to change url without reloading. To handle user input of random strings 8082/hfjkdhjfkds
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    init(store);
}

//react components, constructors and classes start with first capital letter!
ReactDOM.render(elem, document.querySelector("main"));
