import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

let styleObj = {
    fontSize: "30px"
};

//component function
export default function Welcome() {
    return (
        <div className="center">
            <img src="social-network.jpg" height={300} width={300} />
            <div id="container1" className="center">
                <div className="brand">
                    M<i className="fas fa-video moment" />
                    MENT <span style={styleObj}>MAL</span>
                </div>

                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        </div>
    );
}

//the value of attribute must be an expression or a string. Unline statement, expression returns something
//if more than two elements are returned, enclosed them with <div>
//class is predefined in js. So use className

//exact added to path / so that it renders only one registration route instead of both routes (/login route starts with /)
//to avoid making request and reload page, <a href> isnt used here. Use Link! Link doesnt make request from backend server
