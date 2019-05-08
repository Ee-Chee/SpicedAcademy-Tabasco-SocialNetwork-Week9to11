const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const dB = require("./utilities/db");
const bct = require("./utilities/bcrypt");

//////////////////////////////////////upload image to Amazon s3 cloud
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const cf = require("./config.json");
////////////////////////////////////////socket IO
const server = require("http").Server(app); //make a server not using express but native way
const io = require("socket.io")(server, {
    origins: "localhost:8082 yourfunkychickenapp.herokuapp.com:*"
}); //Make the sockets true for only this port to prevent csrf-like attack
////////////////////////////////////////////////////

app.use(compression()); //compress size of the file making it downloaded faster on the browser

////////////////////////////////////////////
//Websocket runs first before express, so userId must be retrieved first.
//There are many ways to retrieve userId for socket IO. This is the safest (use middleware like what we did to express app and do it on server).
//To pass the current userId during handshake between client and server (socketIO), middleware function is made
const cookieSessionMiddleware = cookieSession({
    secret: `I'm wondering...`,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware); //for http express use

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//for socketIO use. Middleware function, so must be placed here before IO section
///////////////////////////////////////////
app.use(require("body-parser").json()); //for post! body-parser shld come after cookieSession

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
//CSURF is used to prevent CSRF attack from outside world like postman. CSURF makes sure the server takes only only post request from user side.
//As soon as user visit the site (even before registered), the csurf cookie(token) is generated and saved on user browser.
//When user is trying to post something, axios will get the token from cookies and pack with other inputs and post them to server.
//Server CSURF will check and match the token. Prompt error if not matched.

app.use(express.static("./public")); //store css and etc

//////////////////////heroku
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//////////////////////////////

app.post("/register", (req, res) => {
    // console.log(req.body);
    bct.hashPassword(req.body.pW)
        .then(hashedPW => {
            return dB
                .addRegister(req.body.fN, req.body.lN, req.body.eM, hashedPW)
                .then(data => {
                    // console.log(data.rows[0].id);
                    req.session.userId = data.rows[0].id;
                    res.json({ status: true });
                });
        })
        .catch(() => {
            // console.log("Error caught: ", err);
            res.json({ status: false });
        });
});

app.post("/logging", (req, res) => {
    // console.log(req.body);
    dB.getLogged(req.body.eM)
        .then(data => {
            return bct
                .checkPassword(req.body.pW, data.rows[0].pw)
                .then(correctPW => {
                    if (correctPW) {
                        req.session.userId = data.rows[0].id;
                        // console.log(req.session.userId);
                        res.json({ status: true });
                    } else {
                        // console.log("im here");
                        res.json({ status: false });
                    }
                });
        })
        .catch(() => {
            // console.log("Error caught: ", err);
            res.json({ status: false });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/user", async (req, res) => {
    // console.log(req.session.userId);
    try {
        const data = await dB.getUserInfo(req.session.userId);
        // console.log(data.rows[0]);
        res.json(data.rows[0]);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});

////////////////////////////////uploading avatar img
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("funky"), s3.upload, (req, res) => {
    // console.log(req.file); //an object that multer added to the req
    // console.log(req.body); //show nothing but there is img inside
    const url = cf.s3Url + req.file.filename;
    dB.addImage(url, req.session.userId)
        .then(data => {
            // console.log(data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("Err caughttt: ", err);
            res.json({ status: false });
        });
});
///////////////////////////////////////////////////

app.post("/bioinput", async (req, res) => {
    // console.log(req.body);
    try {
        const data = await dB.addBio(req.body.bio, req.session.userId);
        res.json(data);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});

app.get("/api/user/:id", async (req, res) => {
    if (req.params.id == req.session.userId) {
        return res.json({
            redirect: true
        });
    } //redirect user to their own profile page if they trying to access their page by typing user:(their id) on url
    //return res.json. 'return is essential here to end the function. Otherwise try...catch will run and an error is caught on server'
    try {
        const data = await dB.getUserInfo(req.params.id);
        res.json(data);
    } catch (err) {
        res.json({ redirect: true });
    } //user input /user/njasnkjfndjkfnjkd
});
//////////////////////////////////////////////handle friendship status
app.get("/friendship/:id", async (req, res) => {
    // console.log(req.session.userId); //viewer
    // console.log(req.params.id); //owner
    try {
        const data = await dB.getFriendStatus(
            req.session.userId,
            req.params.id
        );
        // console.log(data.rows[0]);
        res.json(data.rows[0]);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});

app.post("/handleFriendshipStatus", async (req, res) => {
    // console.log(req.body);
    if (!req.body.trigger) {
        //empty body of trigger => no corresponding id => no data found in friends table
        try {
            const data = await dB.requestFriend(
                req.session.userId,
                req.body.profileownerid
            );
            // console.log(data.rows[0]);
            res.json(data.rows[0]);
        } catch (err) {
            console.log("Err caught: ", err);
        }
    }
    if (req.session.userId === req.body.trigger) {
        try {
            const data = await dB.acceptFriend(req.body.tableid, true);
            res.json(data.rows[0]);
        } catch (err) {
            console.log("Err caught: ", err);
        }
    } else if (req.body.trigger) {
        // console.log("hereeeeee delete");
        try {
            await dB.delete(req.body.trigger);
            res.json({ status: "deleted" });
        } catch (err) {
            console.log("Err caught: ", err);
        }
    }
});

app.get("/api/friends", async (req, res) => {
    // console.log(req.session.userId); //viewer
    // console.log(req.params.id); //owner
    try {
        const data = await dB.getFriends(req.session.userId);
        // console.log(data.rows);
        res.json(data.rows);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});
///////////////////////////checking log-in status
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        // console.log("Im heree");
        res.redirect("/");
    } else {
        // console.log(2);
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        // console.log(1);
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
///////////////////////////////////////////////////////

server.listen(8082, function() {
    console.log("I'm React-project bot and I'm ready to serve you, Sir!");
});
//change from app to server. It is like two servers in one port. Socket IO server runs first before express http server.
//Two different communication protocols used here. Express using http protocol and socket io using websocket
////////////////////////////////////////////socket section///////////////////////////////////////////////////////////
let onlineUsers = {}; //it is placed here to collect all current online users data. If it is placed inside io, onlineUser ={} everytime socket connection established
//socket id is the same for both client side and server side. It is a connection id actually
//socket id runs in real-time enviroment. Changes made by server/client immediately.
//IMPORTANT! If one user opens another tab/refresh the page, another socket is generated & connected! (with different socket ID but same userId).
//IMPORTANT! Everytime a connection established the following codes will run and these codes are individual (server creates one socket platform for each client) to each connected client (e.g. userId doesnt change).
//
io.on("connection", socket => {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    let listBeforeUpdate = Object.assign({}, onlineUsers);
    let newSocketUser = true;
    const userId = socket.request.session.userId;
    onlineUsers[socket.id] = userId;
    // console.log(`socketId: ${socket.id} is now connected`, userId, onlineUsers);
    ////////////////////////////////////////////////////whenever a new socket connection established(Be it the same user(open new page/reload) or different), get online-users data
    dB.getUsersByIds(Object.values(onlineUsers)).then(data => {
        // console.log(data.rows); //an array of objects. ANY function from query helps to filter out all same IDs of data. Data.rows is pure data now.
        let temp = data.rows.filter(user => user.id != userId); //filter out the current socket-connecting user
        socket.emit("onlineUsers", temp);
    });
    //////////////////////////////////////////////broadcast to others if this socket user is new, to rerender the page of other socket users
    for (let socketID in listBeforeUpdate) {
        if (listBeforeUpdate[socketID] === userId) {
            newSocketUser = false;
        }
    }

    if (newSocketUser) {
        dB.getUsersByIds(Object.values(onlineUsers)).then(data => {
            let temp = data.rows.filter(user => user.id == userId);
            io.sockets.sockets[socket.id].broadcast.emit("userJoined", temp);
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    socket.on("disconnect", () => {
        // console.log(`Disconnected: ${socket.id}`, userId);
        delete onlineUsers[socket.id];
        // console.log(onlineUsers);
        // console.log(userId);
        // console.log(Object.values(onlineUsers).includes(1));
        if (!Object.values(onlineUsers).includes(userId)) {
            io.sockets.emit("userLeft", userId);
        }
        // If there is user opening two pages or more and he shuts down one page, it shldnt remove his profile
    });
    //disconnect is predefined event. It is triggered whenever the client loses socket connection
    //refresh the page has the same effect as open in the new page and then close it.

    ///////////////////////////////////////////////////////////////part 9////////////////////////////////////////////////////

    dB.getTop10Comments().then(data => {
        // console.log("////////////////////////////////////////////////////////");
        // console.log(data.rows);
        socket.emit("top10comments", data.rows);
    });

    socket.on("newChatMessage", data => {
        // console.log(data, userId);
        dB.addComment(data, userId).then(data => {
            // console.log(data.rows); //returns comment id
            dB.getComment(data.rows[0].id).then(data => {
                // console.log("here: ", data.rows);
                io.sockets.emit("chatMessageForRedux", data.rows); //socket.broadcast.emit and io.sockets.sockets[socket.id].broad... same thing, but io is used to send all
            });
        });
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});

//Bug: during refresh disconnect and reconnect events run. So we see the user profile rerender in other users profile. Bad user experience
