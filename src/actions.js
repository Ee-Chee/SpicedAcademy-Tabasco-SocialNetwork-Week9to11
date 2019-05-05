import axios from "./axios";

export async function getFriends() {
    const results = await axios.get("/api/friends");
    // console.log(results);
    return {
        type: "get_friends",
        allInteractiveFriends: results.data
    };
}

export async function makeUnfriend(id) {
    //no axios required, it is done by component Friendship
    return {
        type: "make_unfriend",
        id
    };
}

export async function makeFriend(id) {
    //no axios required, it is done by component Friendship
    return {
        type: "make_friend",
        id
    };
}
