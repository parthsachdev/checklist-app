SELECT
	c.category_id,
	c.category_name,
	COALESCE(uc.user_id = $1, false) AS "checked"
FROM "Category" c LEFT JOIN (SELECT * FROM "UserCategory" WHERE user_id = $1) uc ON c.category_id = uc.category_id
LIMIT $2
OFFSET $3;
