import React from "react";
import axios from "./axios";
import Friendship from "./friendship";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log(this.props); //when /:X triggered, the props get passed match, location, history properties
        const id = this.props.match.params.idnum;
        axios
            .get("/api/user/" + id)
            .then(resp => {
                ///api/ to prevent user making request directly to server (if server route is /user/:id)
                if (resp.data.redirect) {
                    this.props.history.push("/");
                } else {
                    //else is used to prevent error when redirect back to "/". 0 properties not defined error
                    //location.replace isnt used here because it reloads the page while history.push() doesnt
                    // console.log(resp.data.rows[0]);
                    this.setState({
                        ln: resp.data.rows[0].lastn,
                        fn: resp.data.rows[0].firstn,
                        id: resp.data.rows[0].id,
                        avatarurl: resp.data.rows[0].avatarurl,
                        biodata: resp.data.rows[0].biotext
                    });
                }
            })
            .catch(() => {
                // console.log("here");
                this.props.history.push("/");
                //to handle user types /user/37473687 or /87668hjhbkjbk (out of range)
            });
    }

    render() {
        if (!this.state.id) {
            return (
                <div className="center">
                    <img
                        src="/circle-loading-gif.gif"
                        height={200}
                        width={200}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <div className="profile">
                        <img
                            src={this.state.avatarurl || "/default-user.png"}
                            height={200}
                            width={200}
                        />
                        <div className="profile-details">
                            <div>
                                {this.state.fn} {this.state.ln}
                            </div>
                            {this.state.biodata}
                        </div>
                    </div>
                    <Friendship profileOwnerId={this.state.id} />
                </div>
            );
        }
    }
}
