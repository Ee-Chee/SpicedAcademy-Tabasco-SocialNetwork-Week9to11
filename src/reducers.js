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

    return state;
}
//note accepted is not null in the case of action.type == "make_unfriend". Database is saved NULL though
