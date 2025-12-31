DROP VIEW IF EXISTS thesis.v_procedure_sample_map;
CREATE VIEW thesis.v_procedure_sample_map AS
SELECT
	 procedure.procedure_id
	,sample.sample_id
	,ROW_NUMBER() OVER (
		 PARTITION BY procedure.procedure_id
		 ORDER BY psm.sample_id, sample.sample_id) AS id
	,sample.name_est AS name
	,CASE
		WHEN psm.procedure_id IS NULL THEN 'Ei'
		ELSE 'Jah' END AS mapped
FROM thesis.procedure

CROSS JOIN thesis.sample

LEFT JOIN thesis.procedure_sample_map AS psm
	ON procedure.procedure_id = psm.procedure_id
	AND sample.sample_id = psm.sample_id

ORDER BY psm.sample_id, sample.sample_id
;