CREATE TABLE thesis.report_procedure_map (
	report_procedure_id SERIAL,
	report_id INTEGER NOT NULL,
	procedure_id SMALLINT NOT NULL,
	method_id SMALLINT,
	sample_id SMALLINT NOT NULL,
	value VARCHAR(64),
	measurement_id SMALLINT,
	archived BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (report_procedure_id),
	FOREIGN KEY (measurement_id) REFERENCES thesis.measurement(measurement_id),
	FOREIGN KEY (report_id) REFERENCES thesis.report(report_id),
	FOREIGN KEY (procedure_id) REFERENCES thesis.procedure(procedure_id),
	FOREIGN KEY (method_id) REFERENCES thesis.method(method_id),
	FOREIGN KEY (sample_id) REFERENCES thesis.sample(sample_id)
);