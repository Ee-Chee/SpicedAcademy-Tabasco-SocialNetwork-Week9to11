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

exports.getLogged = function(email) {
    let q = `SELECT email, pw, id FROM registered WHERE email = $1;`;
    let params = [email];
    return db.query(q, params);
};

exports.getUserInfo = function(id) {
    let q = `SELECT firstN, lastN, id, avatarUrl, bioText FROM registered WHERE id = $1;`;
    let params = [id];
    return db.query(q, params);
};

exports.addImage = function(url, id) {
    let q = `UPDATE registered SET avatarUrl = $1 where id = $2 RETURNING avatarurl ;`;
    let params = [url, id];
    return db.query(q, params);
};

exports.addBio = function(bio, id) {
    let q = `UPDATE registered SET bioText = $1 where id = $2 RETURNING bioText ;`;
    let params = [bio, id];
    return db.query(q, params);
};

//viewer can be sender or recipient. Same goes with owner
exports.getFriendStatus = function(viewer, owner) {
    let q = `SELECT * FROM friends WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);`;
    let params = [viewer, owner];
    return db.query(q, params);
};

//handle "send Friend Request"
exports.requestFriend = function(viewer, owner) {
    let q = `INSERT INTO friends (sender_id, recipient_id) VALUES ($1, $2) RETURNING * ;`;
    let params = [viewer, owner];
    return db.query(q, params);
};

//handle "Accept Friend Request"
exports.acceptFriend = function(tableId, bool) {
    let q = `UPDATE friends SET accepted = $2 WHERE id = $1 RETURNING * ;`;
    let params = [tableId, bool];
    return db.query(q, params);
};

//handle "Unfriend" or "Cancel Friend Request"
exports.delete = function(tableId) {
    let q = `Delete FROM friends WHERE id = $1; `;
    let params = [tableId];
    return db.query(q, params);
};

exports.getFriends = function(viewer_id) {
    let q = `
        SELECT registered.id, firstN, lastN, avatarUrl, accepted
        FROM friends
        JOIN registered
        ON (accepted IS NULL AND recipient_id = $1 AND sender_id = registered.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = registered.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = registered.id)
    ; `;
    let params = [viewer_id];
    return db.query(q, params);
};
//the registered.id, firstN, lastN, avatarUrl should belong to owners/your friends NOT viewer/current user/yourself
//!!!important when the data is null, dont use equal sign accepted = null is wrong. Instead use IS NULL
