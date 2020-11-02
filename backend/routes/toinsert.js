SELECT jsonb_build_object(
	'id', i.id,
	'name',i.name
) AS types FROM inventory_types i