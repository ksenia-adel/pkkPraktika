DROP VIEW IF EXISTS thesis.v_procedure;
CREATE VIEW thesis.v_procedure AS
SELECT
	 procedure_id AS id
	,name_est
	,name_eng
	,archived
FROM thesis.procedure
ORDER BY id;