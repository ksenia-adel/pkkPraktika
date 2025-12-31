CREATE TABLE thesis.role (
	role_id SERIAL,
	name VARCHAR(32) NOT NULL,
	comment VARCHAR(256),
	archived BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (role_id)
);

INSERT INTO thesis.role (name, comment)
VALUES ('admin', 'Testing admin role');