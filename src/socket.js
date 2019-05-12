import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    topComments,
    addComment,
    draw,
    start
} from "./actions";

export let socket; //use in part 9, export to chat.js so that it still connected and all events defined are passed

//this is initialization function which is used to retrieve all online users data and stores the data in Redux. But not displaying. OnlineFriends component handles the rendering part
export function init(store) {
    //export is needed here
    if (!socket) {
        // console.log("undefined socket, ", socket);
        socket = io.connect();

        socket.on("onlineUsers", users => {
            // console.log(users);
            store.dispatch(onlineUsers(users));
        });
        //
        socket.on("userJoined", user => {
            // console.log("test2, ", user);
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", id => {
            // console.log("test3, ", id);
            store.dispatch(userLeft(id));
        });
        /////////////////////////////////////////
        socket.on("top10comments", comments => {
            // console.log(comments);
            store.dispatch(topComments(comments));
        });

        socket.on("chatMessageForRedux", comment => {
            // console.log("here: ", comment);
            store.dispatch(addComment(comment));
        });

        socket.on("moving", coorArr => {
            store.dispatch(draw(coorArr));
        });

        socket.on("startingPoint", coorArr => {
            // console.log("here: ", coorArr);
            store.dispatch(start(coorArr));
        });

        socket.on("refresh", () => {
            location.reload();
        });
    }
    //it is you return  socket here and export this function or export the let socket
}
