CREATE TABLE IF NOT EXISTS "UserCategory" (
	user_category_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	category_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT NULL,
	CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES "Category"(category_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT user_category_unique UNIQUE (user_id, category_id)
);

ALTER TABLE "UserCategory" ALTER COLUMN created_at SET DEFAULT NOW();
