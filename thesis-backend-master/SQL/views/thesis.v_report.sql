DROP VIEW IF EXISTS thesis.v_report;
CREATE VIEW thesis.v_report AS 
SELECT
	 report.report_id AS id
	,customer.customer_id
	,customer.company_name
	,customer.company_registration_code
	,customer.company_address
	,customer.customer_contact_person
	,customer.customer_email
	,customer.customer_phone
	,To_Char(report.samples_received_date, 'yyyy-mm-dd') AS samples_received_date
	,To_Char(report.start_date, 'yyyy-mm-dd') AS start_date
	,To_Char(report.end_date, 'yyyy-mm-dd') AS end_date
	,report.insertor_user_id
	,report.generation_time
	,report.generator_user_id
	,report.notes
	,report.archived
FROM thesis.report

INNER JOIN thesis.customer
	ON report.customer_id = customer.customer_id

WHERE report.archived = FALSE
	AND customer.archived = FALSE

ORDER BY id
;
