import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

//component class
export default class Registration extends React.Component {
    //super() function allows "this" refers to its parent(inherits from React.Component class in this case)
    //render() is the method inherited from React.Component. Rendering occurs each time state data updated
    //argument passed to super() refers exactly to the argument passed to class React.Component see week9 Tue 'class' note. If the class takes 2 arguments, 2 arguments shall be expected in super()
    //arguement passed to constructor make it possible to accessible else where after the line. It is then passed down to argument super()
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.inputs = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        // console.log(this); //undefined if no binding
        this.inputs[e.target.name] = e.target.value;
        // [property] making property as a variable which is the name attribute of the input tag.
        // return console.log(this.state); //comment out the bind handleChange and test. Error! with return too
    }

    submit(e) {
        e.preventDefault();
        // console.log("heheheh", this.inputs);
        //prevent form submitting inputs/making post request when button (type: submit) is clicked. Anyway button-type-submit is removed here.
        axios.post("/register", this.inputs).then(resp => {
            // console.log(resp);
            //arrow function makes 'this' working inside axios nested function
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
                        placeholder="First Name"
                        name="fN"
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lN"
                        onChange={this.handleChange}
                    />
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
                    <button onClick={this.submit}>
                        Do you wanna build a snowman?
                    </button>
                </form>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}

//use component class when it needs to have a state property that is updated in response to changes. State object is used here.
//arrow function helps to escape from using bind or temp = this ('this' undefined error)
//if-else outside return is ok too. But not inside {} because it is a statement. Example above is expression though.
//onInput works

//////another solution (define functions inside render(), 'this' is workable without binding and 'this' is not necessary for handleXX function because they are defined inside return)
// render() {
//     const handleFN = e => {
//         // console.log(e.target.value);
//         // console.log(this);
//         this.inputs.fN = e.target.value;
//     };
//
//     const handleLN = e => {
//         this.inputs.lN = e.target.value;
//     };
//
//     const handleEM = e => {
//         this.inputs.eM = e.target.value;
//     };
//
//     const handlePW = e => {
//         this.inputs.pW = e.target.value;
//     };
//
//     const submit = () => {
//         // console.log(this.inputs);
//         axios.post("/register", this.inputs).then(resp => {
//             // console.log(resp);
//             this.setState({ valid: resp.data.status });
//         });
//     };
//
//     return (
//         <div className="center">
//             {this.state.valid ? (
//                 <div />
//             ) : (
//                 <div>Invalid inputs! Try again!</div>
//             )}
//
//             <input
//                 type="text"
//                 placeholder="First Name"
//                 onChange={handleFN}
//             />
//             <input
//                 type="text"
//                 placeholder="Last Name"
//                 onChange={handleLN}
//             />
//             <input
//                 type="text"
//                 placeholder="Email Address"
//                 onChange={handleEM}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 onChange={handlePW}
//             />
//             <button onClick={submit}>Do you wanna build a snowman?</button>
//         </div>
//     );
// }
////////////////////
