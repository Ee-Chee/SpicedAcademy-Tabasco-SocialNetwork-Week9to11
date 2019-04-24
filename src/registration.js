import React from "react";
import Welcome from "./welcome";
import axios from "axios";

//component class
export default class Registration extends React.Component {
    //super() function allows "this" refers to its parent(inherits from React.Component class in this case)
    //render() is the method inherited from React.Component. Rendering occurs each time state data updated
    //argument passed to super() refers exactly to the argument passed to class React.Component see week9 Tue 'class' note. If the class takes 2 arguments, 2 arguments shall be expected in super()
    //arguement passed to constructor make it possible to accessible else where after the line. It is then passed down to argument super()
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.inputs = {
            fN: "",
            lN: "",
            eM: "",
            pW: ""
        };
    }

    render() {
        const handleFN = e => {
            // console.log(e.target.value);
            // console.log(this);
            this.inputs.fN = e.target.value;
        };

        const handleLN = e => {
            this.inputs.lN = e.target.value;
        };

        const handleEM = e => {
            this.inputs.eM = e.target.value;
        };

        const handlePW = e => {
            this.inputs.pW = e.target.value;
        };

        const submit = () => {
            // console.log(this.inputs);
            axios.post("/register", this.inputs).then(resp => {
                // console.log(resp);
                this.setState({ valid: resp.data.status });
            });
        };

        return (
            <div className="center">
                <Welcome />
                {this.state.valid ? (
                    <div />
                ) : (
                    <div>Invalid inputs! Try again!</div>
                )}

                <input
                    type="text"
                    placeholder="First Name"
                    onChange={handleFN}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    onChange={handleLN}
                />
                <input
                    type="text"
                    placeholder="Email Address"
                    onChange={handleEM}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={handlePW}
                />
                <button onClick={submit}>Do you wanna build a snowman?</button>
            </div>
        );
    }
}

//use component class when it needs to have a state property that is updated in response to changes. State object is used here.
//arrow function helps to escape from using bind or temp = this ('this' undefined error)
//if-else outside return is ok too. But not inside {} because it is a statement. Example above is expression though.
