DROP TABLE IF EXISTS friends;
CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER,
    recipient_id INTEGER,
    accepted BOOLEAN
);
