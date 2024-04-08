DELETE FROM "UserCategory"
WHERE "user_id" = %s AND "category_id" = ANY('{%s}');
