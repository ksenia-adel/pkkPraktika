DROP VIEW IF EXISTS thesis.v_measurement;
CREATE VIEW thesis.v_measurement AS
SELECT
	 measurement_id AS id
	,unit
FROM thesis.measurement
ORDER BY id;