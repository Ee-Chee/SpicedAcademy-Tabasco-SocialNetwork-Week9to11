import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";

class Chat extends React.Component {
    componentDidMount() {
        if (this.myDiv) {
            this.myDiv.scrollTop = this.myDiv.scrollHeight;
        }
    }
    //mounted function runs once only but if(this.myDiv) will still be triggered automatically when this-myDiv available during rendering.
    //It seems like mounted function actually mounts its content and if a conditional statement is mounted, it will be triggered when it is true during rendering

    componentDidUpdate() {
        // console.log("hihi", this.myDiv.scrollHeight);
        this.myDiv.scrollTop = this.myDiv.scrollHeight; //scroll all the way down to bottom everytime update made
    }
    //chat container was binded and packed and saved at myDiv and the binded chat container must be the div that made scrollable

    handleInput(e) {
        if (e.which === 13) {
            // console.log(e.target.value);
            var newChat = e.target.value.trim(); //remove all empty spaces in front or back
            socket.emit("newChatMessage", newChat);
            e.target.value = "";
            e.preventDefault(); //prevent enter key works after pressing enter
        }
    }

    render() {
        if (!this.props.allChats) {
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
        }

        const comments = this.props.allChats;
        const allComments = (
            <div className="center text">
                <h1>Chat Chamber</h1>
                <div className="nicewrap">
                    <div
                        className="chats"
                        ref={chatsContainer => (this.myDiv = chatsContainer)}
                    >
                        {comments.map(user => (
                            <div
                                className="commentwrap text2"
                                key={user.commentid}
                            >
                                <img
                                    src={user.avatarurl}
                                    height={100}
                                    width={100}
                                />
                                <div className="col">
                                    <div className="profile">
                                        {user.firstn} {user.lastn},{" "}
                                        {Date(user.created_at).split("GMT", 1)}
                                    </div>
                                    {user.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <textarea
                            onKeyDown={this.handleInput}
                            className="inputfield text"
                        />
                    </div>
                </div>
            </div>
        );
        return (
            <div>
                {!comments.length && <h3>No chats at the moment!</h3>}
                {!!comments.length && allComments}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        allChats: state.topComments
    };
};

export default connect(mapStateToProps)(Chat);
