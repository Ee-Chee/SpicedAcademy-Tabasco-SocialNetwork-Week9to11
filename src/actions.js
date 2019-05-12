import axios from "./axios";

export async function getFriends() {
    const results = await axios.get("/api/friends");
    // console.log(results.data); // [{},{},...]
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

export async function onlineUsers(users) {
    //users is [{},{},...]
    return {
        type: "online_users",
        users
    };
}

export async function userJoined(user) {
    // users is [{}]
    // console.log(user);
    return {
        type: "add_user",
        user
    };
}

export async function userLeft(id) {
    return {
        type: "remove_leftuser",
        id
    };
}

export async function topComments(comments) {
    return {
        type: "10_comments",
        comments
    };
}

export async function addComment(comment) {
    return {
        type: "add_comment",
        comment
    };
}

export async function draw(coorArr) {
    return {
        type: "draw",
        coorArr
    };
}

export async function start(coorArr) {
    return {
        type: "start",
        coorArr
    };
}
