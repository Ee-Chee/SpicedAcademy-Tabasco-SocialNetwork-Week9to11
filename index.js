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
////////////////////////////////////////////////////////////////////////

app.use(compression()); //compress size of the file making it downloaded faster on the browser

app.use(
    cookieSession({
        secret: `I'm wondering...`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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

app.listen(8082, function() {
    console.log("I'm listening.");
});
