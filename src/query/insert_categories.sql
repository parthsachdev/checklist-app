INSERT INTO "Category"(category_name)
VALUES ('Car'),
('Home'),
('Work'),
('Personal'),
('Health'),
('Finance'),
('Education'),
('Entertainment'),
('Travel'),
('Shopping'),
('Food'),
('Other')
RETURNING *;
