DROP VIEW IF EXISTS thesis.v_customer;
CREATE VIEW thesis.v_customer AS
SELECT
	 customer_id AS id
	,company_name
	,company_registration_code
	,company_address
	,customer_contact_person
	,customer_email
	,customer_phone
	,archived
FROM thesis.customer
ORDER BY id
;