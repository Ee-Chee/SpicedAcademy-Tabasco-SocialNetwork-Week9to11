const express = require("express");
const app = express();
const compression = require("compression");

app.use(compression());

const users = [
    {
        id: 1,
        name: "Mario",
        image:
            "https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png"
    },
    {
        id: 2,
        name: "Hello Kitty",
        image:
            "https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png"
    },
    {
        id: 3,
        name: "Homer Simpson",
        image:
            "https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png"
    },
    {
        id: 4,
        name: "Maleficent",
        image:
            "https://upload.wikimedia.org/wikipedia/en/a/a9/Maleficent_disney.png"
    },
    {
        id: 5,
        name: "Chewbacca",
        image: "https://upload.wikimedia.org/wikipedia/en/6/6d/Chewbacca-2-.jpg"
    },
    {
        id: 6,
        name: "Miss Piggy",
        image: "https://upload.wikimedia.org/wikipedia/en/2/22/MissPiggy.jpg"
    }
];

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

app.use(express.static("./public"));

app.get("/users", (req, res) => res.json({ users }));

app.post("/hot/:id", (req, res) => {
    const user = users.find(user => user.id == req.params.id);
    if (user) {
        user.hot = true;
    }
    res.json({
        success: !!user
    });
});

app.post("/not/:id", (req, res) => {
    const user = users.find(user => user.id == req.params.id);
    if (user) {
        user.hot = false;
    }
    res.json({
        success: !!user
    });
});

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8082, function() {
    console.log("I'm listening.");
});
