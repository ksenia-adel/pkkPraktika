DROP VIEW IF EXISTS thesis.v_method;
CREATE VIEW thesis.v_method AS
SELECT
	 method_id AS id
	,name
	,CASE
		WHEN accredited = true THEN 'Jah'
		ELSE 'Ei' END AS accredited
	,archived
FROM thesis.method
ORDER BY id;