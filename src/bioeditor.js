import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.biotext = this.props.bioData;
        this.submit = this.submit.bind(this);
    }

    submit() {
        return axios.post("/bioinput", { bio: this.biotext }).then(resp => {
            // console.log("return", resp.data.rows[0]);
            if (!resp.data.rows[0].biotext) {
                // console.log("hhhih");
                this.setState({ added: false });
            } //if no biodata, restart again because no data added
            this.setState({ toggleBioTextField: false });
            this.props.bioHandler([
                resp.data.rows[0].biotext,
                this.state.toggleBioTextField
            ]);

            // console.log(this.state.toggleBioTextField);
        });
    }

    //the biotext must be passed to mounted function so that, it appears on the page after user relogin.
    //Supposingly, pass it to grandparent App <= profile <=bioeditor. But when using short-cut approach, straight away modify only biodata function on App grandparent

    render() {
        return (
            <div>
                {!this.props.bioData && !this.state.added && (
                    <button
                        onClick={() => {
                            this.setState({
                                toggleBioTextField: true,
                                added: true
                            });
                        }}
                    >
                        Add your bio now!
                    </button>
                )}
                {this.state.toggleBioTextField && (
                    //if two elements/tags needed, pack them up
                    <div className="col">
                        <textarea
                            className="text"
                            // type="text"
                            rows="8"
                            cols="50"
                            placeholder="Tell us more about you..."
                            defaultValue={this.props.bioData}
                            onChange={e => {
                                this.biotext = e.target.value;
                            }}
                        />
                        <button onClick={this.submit}>Save</button>
                    </div>
                )}
                {this.props.bioData && !this.state.toggleBioTextField && (
                    <div>
                        <div className="text">{this.props.bioData}</div>
                        <button
                            onClick={() =>
                                this.setState({ toggleBioTextField: true })
                            }
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
//this.props.bioData refers to the data/bio saved in database!!!
//USE only {} and "" inside Return!!!!. This is JSL rule
