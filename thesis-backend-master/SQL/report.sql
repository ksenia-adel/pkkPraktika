CREATE TABLE thesis.report (
	report_id SERIAL,
	customer_id SMALLINT NOT NULL,
	samples_received_date DATE,
	start_date DATE,
	end_date DATE,
	insertor_user_id SMALLINT NOT NULL,
	generation_time TIMESTAMP WITHOUT TIME ZONE,
	generator_user_id SMALLINT,
	notes VARCHAR(2048),
	archived BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (report_id),
	FOREIGN KEY (customer_id) REFERENCES thesis.customer(customer_id),
	FOREIGN KEY (generator_user_id)	REFERENCES thesis.user(user_id),
	FOREIGN KEY (insertor_user_id) REFERENCES thesis.user(user_id)
);