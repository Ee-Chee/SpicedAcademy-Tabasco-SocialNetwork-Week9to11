const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
// const csurf = require("csurf");
const dB = require("./utilities/db");
const bct = require("./utilities/bcrypt");

app.use(compression()); //compress size of the file making it downloaded faster on the browser

app.use(
    cookieSession({
        secret: `I'm wondering...`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
app.use(require("body-parser").json()); //for post! body-parser shld come after cookieSession
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

///////////////////////////checking log-in status
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
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
