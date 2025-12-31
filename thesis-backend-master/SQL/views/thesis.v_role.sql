DROP VIEW IF EXISTS thesis.v_role;
CREATE VIEW thesis.v_role AS
SELECT
	 role_id AS id
	,name
	,comment
	,archived
FROM thesis.role
ORDER BY id;