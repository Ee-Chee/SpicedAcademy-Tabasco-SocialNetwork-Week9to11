import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFriends, makeUnfriend, makeFriend } from "./actions";
import Friendship from "./friendship";

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(getFriends());
        // this.props.dispatch(getRequestingFriends());
    }
    render() {
        // console.log("CHECK HERE: ", this.props);
        //dont console.log this.props in mounted function, rerender occurs after a short while the data is retrieved
        const currentFriends = this.props.existingFriends;
        const requestingFriends = this.props.requestingFriends;

        if (!currentFriends) {
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
        } //to handle undefined data while waiting for axios retrieving data. Otherwise, error prompted for currentFriends.map undefined below
        const myFriends = (
            <div>
                <h2>My added friends</h2>
                <div className="profile">
                    {currentFriends.map(friend => (
                        <div className="center" key={friend.id}>
                            <img
                                src={friend.avatarurl}
                                height={100}
                                width={100}
                            />
                            {friend.firstn} {friend.lastn}
                            <Friendship
                                handleError={true}
                                profileOwnerId={friend.id}
                                // change={boolean => {
                                //     console.log("heresf", boolean);
                                //     this.forceUpdate();
                                // }}
                                makeReduxStateChange={boolean => {
                                    if (boolean) {
                                        this.props.dispatch(
                                            makeUnfriend(friend.id)
                                        );
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
        //////////////////////////////////////////////////////////////////////////////////////
        const friendRequesters = (
            <div>
                <h2>These people wanna be your friends</h2>
                <div className="profile">
                    {requestingFriends.map(friend => (
                        <div className="center" key={friend.id}>
                            <img
                                src={friend.avatarurl}
                                height={100}
                                width={100}
                            />
                            {friend.firstn} {friend.lastn}
                            <Friendship
                                handleError={true}
                                profileOwnerId={friend.id}
                                // change={boolean => {
                                //     console.log("heresf", boolean);
                                //     this.forceUpdate();
                                // }}
                                makeReduxStateChange={boolean => {
                                    if (boolean) {
                                        this.props.dispatch(
                                            makeFriend(friend.id)
                                        );
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
        return (
            <div>
                {!currentFriends.length && (
                    <h3>
                        You might want to check-out other profiles and make a
                        friend request
                    </h3>
                )}
                {!!currentFriends.length && myFriends}
                {!requestingFriends.length && (
                    <h3>You have no requesters at the moment.</h3>
                )}
                {!!requestingFriends.length && friendRequesters}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        existingFriends:
            state.allKnownFriends &&
            state.allKnownFriends.filter(friend => friend.accepted),
        //it wouldnt rerender when you unfriend one of your friend because Frienship is a child component here. No state changes on this current page/js file
        //forceUpdate() is used for rerendering without any state change. But it is not working here because axios is in mounted function.
        //Rerendering doesnt make mounted function runs.Hence the updated data (ie. accepted = false) isnt fetched. It remains "true" while forced rerendering
        //Solution: passing a boolean from friendship component(child) to friend(parent) to trigger the makeUnfriend action. And this will update redux state and rerender again
        requestingFriends:
            state.allKnownFriends &&
            state.allKnownFriends.filter(friend => friend.accepted === null)
        //null is important here. If user accepts the friend request, the profile goes to "added friends" and if user unfriends further, the profile should disappear.
        //To make the profile gone, !friend.accepted doesnt work because it triggers when !null, !false, !undefined. I make reducer returns false when it happens so that state-change doesnt happen.
    };
};

//Provider passes store (with states info) to connect(). Connect() connects both side and changes the states info to props and pass props to Friends components
export default connect(mapStateToProps)(Friends);
