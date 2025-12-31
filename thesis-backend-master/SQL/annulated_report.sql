CREATE TABLE thesis.annulated_report (
	id SERIAL,
	annulated_report_id INTEGER,
	annulator_user_id SMALLINT NOT NULL,
	annulation_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()::TIMESTAMP(0),
	annulation_reason VARCHAR(1024) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (annulated_report_id) REFERENCES thesis.report(report_id),
	FOREIGN KEY (annulator_user_id) REFERENCES thesis.user(user_id)
);