CREATE TABLE thesis.customer (
	customer_id SERIAL,
	company_name VARCHAR(128) NOT NULL,
	company_registration_code VARCHAR(64),
	company_address VARCHAR(256),
	customer_contact_person VARCHAR(128),
	customer_email VARCHAR(128),
	customer_phone VARCHAR(32),
	archived BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (customer_id)
);