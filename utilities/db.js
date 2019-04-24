//create connection pooling, to handle sudden burst of traffic
var spicedPg = require("spiced-pg");
//postges:username:password@port/database
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social-network"
);

exports.addRegister = function(firstName, lastName, email, passW) {
    let q = `INSERT INTO registered (firstN, lastN, email, pw) VALUES ($1, $2, $3, $4) RETURNING * ;`;
    let params = [firstName, lastName, email, passW];
    return db.query(q, params);
};
