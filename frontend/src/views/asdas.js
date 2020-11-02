SELECT * FROM (
	
	SELECT 
		client_id,
		project_id,
		jsonb_build_object(
			'products',
			json_agg(p_items)
		), location ,revision, date,
				site_supervisor,
				autocad_engineer,
				plan_approved_by,
				labour_contractor,
				person_id,
				products_headings
	FROM
	(
			SELECT 
				client_id, jc.project_id,
				jc.location,revision, date,
				site_supervisor,
				autocad_engineer,
				plan_approved_by,
				labour_contractor,
				person_id,
				products_headings,
				jsonb_build_object(
					'heading', heading_elems -> 'heading',
					'subheading', heading_elems -> 'subheading',
					'pItems', json_agg(elems || jsonb_build_object('product_name', po.name))
				) AS p_items
				
			FROM jobcards jc CROSS JOIN LATERAL
				jsonb_array_elements(jc.products_headings) AS heading_elems CROSS JOIN LATERAL
				jsonb_array_elements(heading_elems -> 'pItems') AS elems
				JOIN products po ON (elems ->> 'pid' )::int = po.product_id
				GROUP BY  client_id, jc.project_id, heading_elems,  location ,revision, date,
				site_supervisor,
				autocad_engineer,
				plan_approved_by,
				labour_contractor,
				person_id,
				products_headings
				
	) s
	GROUP BY client_id, project_id, location ,revision, date,
				site_supervisor,
				autocad_engineer,
				plan_approved_by,
				labour_contractor,
				person_id,
				products_headings
) s


INNER JOIN clients client ON client.client_id = s.client_id
INNER JOIN projects project on project.project_id = s.project_id