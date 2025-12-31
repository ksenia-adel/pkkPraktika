CREATE TABLE thesis.user (
	user_id SERIAL,
	username VARCHAR(32) UNIQUE NOT NULL,
	password VARCHAR(256) NOT NULL,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	email VARCHAR(128) NOT NULL,
	profession VARCHAR(64),
	address VARCHAR(256),
	create_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()::TIMESTAMP(0),
	role_id SMALLINT NOT NULL,
	role_grant_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()::TIMESTAMP(0),
	role_grantor_user_id SMALLINT NOT NULL,
	role_validity_date DATE,
	archived BOOLEAN NOT NULL DEFAULT FALSE,
	active BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (user_id),
	FOREIGN KEY (role_id) REFERENCES thesis.role(role_id)
);

INSERT INTO thesis.user (username, password, firstname, lastname, email, role_id, role_grantor_user_id, active)
VALUES ('admin', 'admin', 'firstname', 'lastname', 'firstname.lastname@gmail.com', 1, 1, TRUE);