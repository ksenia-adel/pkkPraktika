DROP VIEW IF EXISTS thesis.v_user;
CREATE VIEW thesis.v_user AS
SELECT
	 u.user_id AS id
	,u.username
	,u.firstname
	,u.lastname
	,u.email
	,u.profession
	,u.address
	,r.name AS role_name
	,u.role_id
FROM thesis.user AS u
INNER JOIN thesis.role AS r
	ON u.role_id = r.role_id
ORDER BY id
;