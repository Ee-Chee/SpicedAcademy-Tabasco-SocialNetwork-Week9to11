import React from "react";
import axios from "./axios";
import Avatar from "./avatar";
import Uploader from "./uploader";
import Profile from "./profile";
import BioEditor from "./bioeditor";
import OtherProfile from "./otherprofile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Friends from "./friends";
import OnlineFriends from "./onlinefriends";
import Chat from "./chat";
import Snowman from "./snowman";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.pendingData = {};
    }
    //life cycle - during mounted. Runs before render()
    componentDidMount() {
        axios.get("/user").then(resp => {
            // console.log("see ", resp.data);
            this.setState({
                ln: resp.data.lastn,
                fn: resp.data.firstn,
                id: resp.data.id,
                avatarurl: resp.data.avatarurl,
                biodata: resp.data.biotext
            });
        });
    }

    //To understand 3 dots ... in js => https://dev.to/sagar/three-dots---in-javascript-26ci.
    //Can be applied ob above example => this.setState({...data})

    //render() runs everytime states change
    render() {
        if (!this.state.id) {
            return (
                <div className="center">
                    <h2>Hang on, loading the page!</h2>
                    <img
                        src="/circle-loading-gif.gif"
                        height={200}
                        width={200}
                    />
                </div>
            );
        } else {
            return (
                <BrowserRouter>
                    <div>
                        <div className="app">
                            <img
                                src="/social-network.jpg"
                                height={100}
                                width={100}
                            />
                            <div id="toptext">
                                Welcome, you are the{" "}
                                <span id="num">#{this.state.id}</span> snow
                                builder
                            </div>
                            <Link className="link" to="/">
                                Bio
                            </Link>
                            <Link className="link" to="/friends">
                                My snow builders
                            </Link>
                            <Link className="link" to="/online">
                                Online builders
                            </Link>
                            <Link className="link" to="/chat">
                                Chit-Chat
                            </Link>
                            <Link className="link" to="/snowman">
                                Okay, lets build a snowman!
                            </Link>
                            <div>
                                <Avatar
                                    imageUrl={this.state.avatarurl}
                                    clickHandler={() =>
                                        this.setState({ uploaderVisible: true })
                                    }
                                    hi={100}
                                    wif={100}
                                />
                            </div>
                            <div id="addtional-function">
                                <a className="link" href="/logout">
                                    <i className="fas fa-door-open" />
                                </a>
                                <p
                                    className="link"
                                    onClick={() =>
                                        this.setState({
                                            uploaderVisible: true
                                        })
                                    }
                                >
                                    <i className="fas fa-cloud-upload-alt" />
                                </p>
                            </div>
                        </div>
                        {this.state.uploaderVisible && (
                            <Uploader
                                handleImage={url =>
                                    this.setState({ avatarurl: url })
                                }
                                change={boolean =>
                                    this.setState({ uploaderVisible: boolean })
                                }
                            />
                        )}
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        /* comment inside JSL */
                                        firstN={this.state.fn}
                                        lastN={this.state.ln}
                                        profilePic={
                                            <Avatar
                                                imageUrl={this.state.avatarurl}
                                                clickHandler={() =>
                                                    this.setState({
                                                        uploaderVisible: true
                                                    })
                                                }
                                                hi={200}
                                                wif={200}
                                            />
                                        }
                                        bio={
                                            <BioEditor
                                                bioData={this.state.biodata}
                                                bioHandler={arrBioData => {
                                                    // console.log("im here", arrBioData[0]);
                                                    this.setState({
                                                        biodata: arrBioData[0]
                                                    });
                                                }}
                                            />
                                        }
                                        // ORRRRRRRRRRRRRRR
                                        // <Profile
                                        //     id={this.state.id}
                                        //     first={this.state.first}
                                        //     last={this.state.last}
                                        //     image={this.state.image}
                                        //     onClick={this.showUploader}
                                        //     bio={this.state.bio}
                                        //     setBio={this.setBio}
                                        // />
                                        // and then pass to its children which are Avatar and Bio components
                                    />
                                );
                            }}
                        />
                        <Route path="/user/:idnum" component={OtherProfile} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/online" component={OnlineFriends} />
                        <Route path="/chat" component={Chat} />
                        <Route path="/snowman" component={Snowman} />
                    </div>
                </BrowserRouter>
            );
        }
    }
}
///if(!this.state.id) to display loading page while axios is doing his job

//////////////////////////////////////////////////////////////extra//////////////////////////////////////////
// this feature isn't used right now but if a loggin user goes to user 11 profile and click a link on user 11 profile to user 15 profile, the new component will not render but url link changes.
//Use this to solve:
// <Route
//     path="/user/:id"
//     render={props => (
//         <OtherProfile
//             key={props.match.url}
//             match={props.match}
//             history={props.history}
//         />
//     )}
// />
