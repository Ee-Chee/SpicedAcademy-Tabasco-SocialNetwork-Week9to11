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
                            <h1>
                                Welcome, you are number #{this.state.id} user
                            </h1>
                            <Link to="/friends">My friends</Link>
                            <Link to="/online">Check whos online</Link>
                            <Link to="/chat">Lets chat</Link>
                            <div>
                                <Avatar
                                    imageUrl={this.state.avatarurl}
                                    clickHandler={() =>
                                        this.setState({ uploaderVisible: true })
                                    }
                                    hi={100}
                                    wif={100}
                                />
                                <a href="/logout">log out</a>
                            </div>
                        </div>
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
                    </div>
                </BrowserRouter>
            );
        }
    }
}
///if(!this.state.id) to display loading page while axios is doing his job
