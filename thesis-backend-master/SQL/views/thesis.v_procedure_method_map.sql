DROP VIEW IF EXISTS thesis.v_procedure_method_map;
CREATE VIEW thesis.v_procedure_method_map AS
SELECT
	 procedure.procedure_id
	,method.method_id
	,ROW_NUMBER() OVER (
		 PARTITION BY procedure.procedure_id
		 ORDER BY pmm.method_id, method.method_id) AS id
	,method.name
	,CASE
		WHEN accredited = true THEN 'Jah'
		ELSE 'Ei' END AS accredited
	,CASE
		WHEN pmm.procedure_id IS NULL THEN 'Ei'
		ELSE 'Jah' END AS mapped
FROM thesis.procedure

CROSS JOIN thesis.method

LEFT JOIN thesis.procedure_method_map AS pmm
	ON procedure.procedure_id = pmm.procedure_id
	AND method.method_id = pmm.method_id

ORDER BY pmm.method_id, method.method_id
;