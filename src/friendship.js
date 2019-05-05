import React from "react";
import axios from "./axios";

export default class Friendship extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = this.props.profileOwnerId;
        axios
            .get("/friendship/" + id)
            .then(resp => {
                // console.log("test1:", resp.data);
                if (!resp.data) {
                    //no friendship data
                    this.setState({ sendRequestFlag: true });
                } else if (resp.data.accepted) {
                    this.setState({
                        //request sent but no accepted yet
                        deleteRequestFlag: true,
                        friendshipId: resp.data.id
                    });
                } else if (id == resp.data.sender_id) {
                    //the profileOwner belongs to sender. It means the profileOwner sending request and asking if the viewer wanna accept the request
                    //OR viewer ID equals recipient_id
                    this.setState({
                        //request sent but no accepted yet
                        acceptRequestFlag: true,
                        recipientId: resp.data.recipient_id,
                        friendshipId: resp.data.id
                    });
                } else {
                    this.setState({
                        //request sent but no accepted yet
                        cancelRequestFlag: true,
                        friendshipId: resp.data.id
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ cancelRequestFlag: true });
            });
    }

    sendFriendRequest() {
        axios
            .post("/handleFriendshipStatus", {
                profileownerid: this.props.profileOwnerId,
                trigger: this.state.friendshipId
            })
            .then(resp => {
                // console.log("test2:", resp.data);
                this.setState({
                    sendRequestFlag: false,
                    cancelRequestFlag: true,
                    friendshipId: resp.data.id
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    delete() {
        axios
            .post("/handleFriendshipStatus", {
                profileownerid: this.props.profileOwnerId,
                trigger: this.state.friendshipId
            })
            .then(resp => {
                // console.log("test3:", resp.data.status);
                if (resp.data.status == "deleted") {
                    this.setState({
                        deleteRequestFlag: false,
                        sendRequestFlag: true,
                        cancelRequestFlag: false,
                        friendshipId: null
                    });
                }
                //////For Friend component. Redux state change
                if (this.props.handleError) {
                    this.props.makeReduxStateChange(true);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    acceptFriendRequest() {
        axios
            .post("/handleFriendshipStatus", {
                profileownerid: this.props.profileOwnerId,
                trigger: this.state.recipientId,
                tableid: this.state.friendshipId
            })
            .then(resp => {
                // console.log("test4:", resp.data);
                if (resp.data.accepted) {
                    this.setState({
                        deleteRequestFlag: true,
                        sendRequestFlag: false,
                        cancelRequestFlag: false,
                        acceptRequestFlag: false
                    });
                }

                if (this.props.handleError) {
                    this.props.makeReduxStateChange(true);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                {this.state.sendRequestFlag && (
                    <button onClick={() => this.sendFriendRequest()}>
                        send a friend request?
                    </button>
                )}
                {this.state.cancelRequestFlag && (
                    <button onClick={() => this.delete()}>
                        cancel the request?
                    </button>
                )}
                {this.state.acceptRequestFlag && (
                    <button onClick={() => this.acceptFriendRequest()}>
                        accept the request?
                    </button>
                )}
                {this.state.deleteRequestFlag && (
                    <button onClick={() => this.delete()}>unfriend?</button>
                )}
            </div>
        );
    }
}

//class is an object. If nested function were to access "this", arrow function should be used.
//E.g. inside render() method if a nested event function is defined, arrow function is used so that "this" refers correctly. ()=>this.sendFriendRequest
