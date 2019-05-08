DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(300) NOT NULL CHECK (comment!=''),
    user_id INTEGER REFERENCES registered(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
