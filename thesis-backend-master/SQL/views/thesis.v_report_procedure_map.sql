DROP VIEW IF EXISTS thesis.v_report_procedure_map;
CREATE VIEW thesis.v_report_procedure_map AS
SELECT
	 rpm.report_procedure_id
	,rpm.report_id
	,rpm.procedure_id
	,ROW_NUMBER() OVER (
		 PARTITION BY rpm.report_id
		 ORDER BY rpm.report_procedure_id) AS id
	,procedure.name_est AS procedure_name_est
	,procedure.name_eng AS procedure_name_eng
	,rpm.method_id
	,method.name AS method_name
	,CASE
		WHEN method.name IS NOT NULL AND method.accredited = true THEN 'Jah'
		WHEN method.name IS NOT NULL AND method.accredited = false THEN 'Ei'
		ELSE null END AS accredited
	,rpm.sample_id
	,sample.name_est AS sample_name_est
	,sample.name_eng AS sample_name_eng
	,rpm.value
	,rpm.measurement_id
	,measurement.unit
FROM thesis.report_procedure_map AS rpm

INNER JOIN thesis.procedure
	ON rpm.procedure_id = procedure.procedure_id

LEFT JOIN thesis.method
	ON rpm.method_id = method.method_id

INNER JOIN thesis.sample
	ON rpm.sample_id = sample.sample_id

LEFT JOIN thesis.measurement
	ON rpm.measurement_id = measurement.measurement_id

ORDER BY id
;