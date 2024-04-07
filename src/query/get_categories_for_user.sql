SELECT
	c.category_id,
	c.category_name,
	COALESCE(uc.user_id = $1, false) AS "checked"
FROM "Category" c LEFT JOIN "UserCategory" uc ON c.category_id = uc.category_id
WHERE uc.user_id = $1 OR uc.user_id IS NULL;

