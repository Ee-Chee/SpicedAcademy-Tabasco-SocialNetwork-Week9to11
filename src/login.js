import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.inputs = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        // console.log("try1", this);
        this.inputs[e.target.name] = e.target.value;
    }

    submit(e) {
        e.preventDefault();
        axios.post("/logging", this.inputs).then(resp => {
            this.setState({ valid: resp.data.status });
            if (resp.data.status === true) {
                location.replace("/welcome");
            }
        });
    }

    render() {
        return (
            <div className="center">
                {this.state.valid ? (
                    <div />
                ) : (
                    <div>Invalid inputs! Try again!</div>
                )}
                <form className="center">
                    <input
                        type="text"
                        placeholder="Email Address"
                        name="eM"
                        onChange={this.handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="pW"
                        onChange={this.handleChange}
                    />
                    <button onClick={this.submit}>Have fun!</button>
                </form>
            </div>
        );
    }
}

//location.replace() redirect to /welcome(making request). With cookie, server directs to route named /pageOne. This route doesnt exist, it goes to * and send html file and render Page1.
