INSERT INTO "User"(email, passhash, user_name)
VALUES ($1, $2, $3)
RETURNING *;

