import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";

class Chat extends React.Component {
    componentDidUpdate() {
        this.myDiv.scrollTop = "200px"; //scroll all the way down to bottom everytime update made
    }
    //chat container was binded and packed and saved at myDiv

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
            <div className="center">
                <h1>Chat Chamber</h1>
                <div
                    className="nicewrap"
                    ref={chatsContainer => (this.myDiv = chatsContainer)}
                >
                    <div className="chats">
                        {comments.map(user => (
                            <div className="commentwrap" key={user.commentid}>
                                <img
                                    src={user.avatarurl}
                                    height={100}
                                    width={100}
                                />
                                <div className="col">
                                    <div className="profile">
                                        {user.firstn} {user.lastn},{" "}
                                        {user.created_at}
                                    </div>
                                    {user.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <textarea
                            onKeyDown={this.handleInput}
                            className="inputfield"
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
