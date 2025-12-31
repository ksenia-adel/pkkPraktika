DROP VIEW IF EXISTS thesis.v_sample;
CREATE VIEW thesis.v_sample AS
SELECT
	 sample_id AS id
	,name_est
	,name_eng
	,archived
FROM thesis.sample
ORDER BY id;