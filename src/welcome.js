import React from "react";

let styleObj = {
    textAlign: "center"
};

//component function
export default function Welcome() {
    return (
        <div className="center">
            <img src="social-network.jpg" height={300} width={300} />
            <h1 style={styleObj}>
                I am excited about my first social network web application!
            </h1>
        </div>
    );
}

//the value of attribute must be an expression or a string. Unline statement, expression returns something
//if more than two elements are returned, enclosed them with <div>
//class is predefined in js. So use className
