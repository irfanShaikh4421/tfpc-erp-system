SELECT DISTINCT ON (i.product_id, i.project_id) COALESCE(i.stock::numeric(12,2), 0::numeric(12,2)) AS stock,
COALESCE(i.avg_rate::numeric(12,2), 0.0::numeric(12,2)) AS avg_rate,
i.type,
i.product_id,
i.project_id,
i.godown_name,
COALESCE(pro.name, i.product_name) AS product_name,
SUM(jp.quantity)::numeric(12,2) AS jobcard_quantity,
( COALESCE(i.stock,0::numeric(12,2))::NUMERIC(12,2) - COALESCE(SUM(jp.quantity),0::numeric(12,2))::NUMERIC(12,2) )::NUMERIC(12,2) AS status
FROM inventory_nd_project i
 FULL JOIN jobcard_products jp ON jp.product_id = i.product_id::integer AND jp.project_id = i.project_id
 FULL JOIN products pro ON jp.product_id = pro.product_id::integer
 FULL JOIN products proo ON i.product_id::integer = proo.product_id::integer
GROUP BY i.stock, i.avg_rate, i.type, i.product_id, i.project_id, i.project_name, i.godown_name, i.product_name, pro.name;













OLD


SELECT DISTINCT ON (i.product_id, i.project_id) COALESCE(i.stock::numeric(12,2), 0::numeric(12,2)) AS stock,
COALESCE(i.avg_rate, 0.0::numeric(12,2)) AS avg_rate,
i.type,
i.product_id,
i.project_id,
i.godown_name,
COALESCE(pro.name, i.product_name) AS product_name,
sum(jp.quantity)::numeric(12,2) AS jobcard_quantity
FROM inventory_nd_project i
 FULL JOIN jobcard_products jp ON jp.product_id = i.product_id::integer AND jp.project_id = i.project_id
 FULL JOIN products pro ON jp.product_id = pro.product_id::integer
 FULL JOIN products proo ON i.product_id::integer = proo.product_id::integer
GROUP BY i.stock, i.avg_rate, i.type, i.product_id, i.project_id, i.project_name, i.godown_name, i.product_name, pro.name;