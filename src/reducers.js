export default function(state = {}, action) {
    if (action.type == "get_friends") {
        state = {
            ...state,
            allKnownFriends: action.allInteractiveFriends
        };
    }

    if (action.type == "make_unfriend" || action.type == "make_friend") {
        state = {
            ...state,
            allKnownFriends: state.allKnownFriends.map(friend => {
                if (friend.id != action.id) {
                    return friend;
                }
                return {
                    ...friend,
                    accepted: action.type == "make_friend"
                };
            })
        };
    }

    if (action.type == "online_users") {
        state = {
            ...state,
            allOnlineFriends: action.users
        };
    }

    if (action.type == "add_user") {
        // console.log("checking state0 ", state.allOnlineFriends);
        // console.log([...state.allOnlineFriends, action.user[0]]);
        state = {
            ...state,
            allOnlineFriends: [...state.allOnlineFriends, action.user[0]]
        };
        // console.log("checking state ", state);
        //dont use push. Doesnt work for object
    }

    if (action.type == "remove_leftuser") {
        // console.log(action.id, state.allOnlineFriends);
        state = {
            ...state,
            allOnlineFriends: state.allOnlineFriends.filter(
                user => user.id != action.id
            )
        };
        // console.log("deleted, ", state);
    }

    if (action.type == "10_comments") {
        state = {
            ...state,
            topComments: action.comments.reverse() //reverse index order so that the latest comment at the bottom
        };
    }

    if (action.type == "add_comment") {
        // console.log("here", action.comment[0]);
        // console.log("here2", state.topComments);
        const temp = state.topComments.filter(
            user => state.topComments.indexOf(user) != 0
        ); //eliminate the oldest data which is index 0 of this array
        // console.log("here3", temp);
        state = {
            ...state,
            topComments: [...temp, action.comment[0]]
        };
        // console.log("here4", state.topComments);
    }

    if (action.type == "draw") {
        state = {
            ...state,
            movingCoordinate: [...action.coorArr]
        };
        // console.log("test2:", state.coordinate);
    }

    if (action.type == "start") {
        state = {
            ...state,
            startingCoordinate: [...action.coorArr]
        };
        // console.log("test2:", state.coordinate);
    }

    return state;
}
//note accepted is not null in the case of action.type == "make_unfriend". Database is saved NULL though
//...state refers to other information in the state. Nothing related with current data. For example, allKnownFriends is one of them/...state. It is used to include all the saved data in the new state. So, Ignore it.
//Update the data using allOnlineFriends: state.allOnlineFriends.someexamplemethod()
