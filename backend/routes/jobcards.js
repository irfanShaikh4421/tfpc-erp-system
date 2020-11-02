const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true,removeAdditional: true})
require('ajv-keywords')(ajv)

const schemas = require('../config/schemas')
const extras = require('../utilities/extras')

const SQL = require('sql-template-strings')



// per route config

const route = {
    table : 'jobcards',
    primaryKey: 'jobcard_id',
    columns : [
        'jobcard_id',
        'client_id',
        'project_id',
        'person_id',
        'location',
        'revision',
        'site_supervisor',
        'autocad_engineer',
        'plan_approved_by',
        'labour_contractor',
        'products_headings'
    ]
    
}

const type_enum = [
    'purchase',
    'selling',
    'trade'
]





const validatePost = ajv.compile(schemas[route.table].POST)
const validateGet = ajv.compile(schemas[route.table].GET)
const validatePatch = ajv.compile(schemas[route.table].PATCH)
const validateDelete = ajv.compile(schemas[route.table].DELETE)



Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))


Router.get('/', Handler.Bless(async (req,res,next) => {
   /* 
   let sql = `SELECT 

        jobcard_id,
        jc.client_id,
        jc.project_id,
        jc.person_id,
        location,
        revision,
        date,
        site_supervisor,
        autocad_engineer,
        plan_approved_by,
        labour_contractor,
        products_headings,
        client.name as client_name,
        project.name as project_name,
        person.name as person_name
        
        FROM ${route.table} jc
        INNER JOIN clients client ON client.client_id = jc.client_id
        INNER JOIN projects project on project.project_id = jc.project_id
        INNER JOIN persons person on person.person_id = jc.person_id
        
        `
        */

        /*
        
       let sql = `SELECT 

       jobcard_id,
       jc.client_id,
       jc.project_id,
       jc.person_id,
       location,
       revision,
       date,
       site_supervisor,
       autocad_engineer,
       plan_approved_by,
       labour_contractor,
       client.name as client_name,
       project.name as project_name,
       person.name as person_name,

       jsonb_build_object(
            'products_headings',
            json_agg(elems || jsonb_build_object('product_name', po.name))
        )->'products_headings' AS products_w_name,
        products_headings

       FROM ${route.table} AS jc CROSS JOIN LATERAL
       jsonb_array_elements(products_headings) AS heading_elems CROSS JOIN LATERAL
       jsonb_array_elements(heading_elems -> 'pItems') AS elems

       
        JOIN products po ON (elems ->> 'pid' )::int = po.product_id

       INNER JOIN clients client ON client.client_id = jc.client_id
       INNER JOIN projects project on project.project_id = jc.project_id
       INNER JOIN persons person on person.person_id = jc.person_id

       GROUP BY jc.jobcard_id, client_name, project_name, person_name

       
       
       `
       */

/*
       
         
      let sql = `SELECT 

      jobcard_id,
      jc.client_id,
      jc.project_id,
      jc.person_id,
      location,
      revision,
      date,
      site_supervisor,
      autocad_engineer,
      plan_approved_by,
      labour_contractor,
      client.name as client_name,
      project.name as project_name,
      person.name as person_name,

        
        jsonb_build_object(
            json_agg(
                jsonb_build_object(

                    'heading', heading_elems->'heading',
                    'subheading', heading_elems -> 'subheading',
                    'pItems', json_agg(elems || jsonb_build_object('product_name', po.name))
                
                )
            
            )

        )

        products_headings AS ph

       

      FROM ${route.table} AS jc CROSS JOIN LATERAL
      jsonb_array_elements(products_headings) AS heading_elems CROSS JOIN LATERAL
      jsonb_array_elements(heading_elems -> 'pItems') AS elems

      
       JOIN products po ON (elems ->> 'pid' )::int = po.product_id

      INNER JOIN clients client ON client.client_id = jc.client_id
      INNER JOIN projects project on project.project_id = jc.project_id
      INNER JOIN persons person on person.person_id = jc.person_id

      GROUP BY jc.jobcard_id, client_name, project_name, person_name, heading_elems`


*/

       

       let sql = ` SELECT * FROM jobcards_latest_view jc `


       //console.log(sql)

    
   if(req.query[route.primaryKey])
   {  
       if(validateGet(req.query))
       {
           sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
           let dbRes = await Db.query(sql,[req.query[route.primaryKey]])
           res.status(dbRes.rows == 0 ? 404 : 200)
           res.json({result: dbRes.rows})
           return;
       }
       else
       {
           res.status(400)
           res.json({errors: validateGet.errors})
           return;
       }
   }
   else if(req.query['client_id'])
   {
        if(validateGet(req.query))
        {
            sql += `WHERE jc.client_id=$1`
            let dbRes = await Db.query(sql,[req.query.client_id])
            res.status(dbRes.rows == 0 ? 404 : 200)
            res.json({results: dbRes.rows})
            return;
        }
        else
        {
            res.status(400)
            res.json({errors: validateGet.errors})
            return;
        }
   }
   

    let limit = 99999
    let offset = 0
    sql += `LIMIT $1 OFFSET $2`

    if(req.body.limit)
        limit =  req.body.limit
    
    if(req.body.offset)
        offset = req.body.offset
        
    

    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))


Router.get('/test', Handler.Bless(async (req,res,next) => {
    

     let sql = ` 
     SELECT project.name AS project_name, person.name AS person_name, client.name AS client_name,s.* FROM 
     
     (
	
        SELECT 
            jobcard_id,
            client_id,
            project_id,
            jsonb_build_object(
                'products',
                json_agg(p_items)
            )->'products' as products_headings, 
            location,
            revision, 
            date,
            site_supervisor,
            autocad_engineer,
            plan_approved_by,
            labour_contractor,
            person_id
                    
        FROM
        (
                SELECT 
                    jc.jobcard_id,client_id, jc.project_id,
                    jc.location,revision, date,
                    site_supervisor,
                    autocad_engineer,
                    plan_approved_by,
                    labour_contractor,
                    person_id,
                    jsonb_build_object(
                        'heading', heading_elems -> 'heading',
                        'subheading', heading_elems -> 'subheading',
                        'pItems', json_agg(elems || jsonb_build_object('product_name', po.name))
                    ) AS p_items
                    
                FROM jobcards jc CROSS JOIN LATERAL
                    jsonb_array_elements(jc.products_headings) AS heading_elems CROSS JOIN LATERAL
                    jsonb_array_elements(heading_elems -> 'pItems') AS elems
                    JOIN products po ON (elems ->> 'pid' )::int = po.product_id
                    
                    
                    GROUP BY  jobcard_id,client_id, jc.project_id, heading_elems,  location ,revision, date,
                    site_supervisor,
                    autocad_engineer,
                    plan_approved_by,
                    labour_contractor,
                    person_id
                    
                    
        ) s
        GROUP BY    jobcard_id, client_id,
                    project_id, location,
                    revision, date,
                    site_supervisor,
                    autocad_engineer,
                    plan_approved_by,
                    labour_contractor,
                    person_id
                    
    ) s
    
    
    INNER JOIN clients client ON client.client_id = s.client_id
    INNER JOIN projects project on project.project_id = s.project_id 
    INNER JOIN persons person on person.person_id = s.person_id 
    `
    
    let result = (await Db.query(sql/*,[limit,offset]*/)).rows

    
    
     res.status(200).json({results:  result })
     
 }))

Router.get('/stock', Handler.Bless(async (req,res,next) => {

    let sql = `SELECT * FROM jobcard_w_inventory jc `
    let params = []
    let num = 0;

    if(req.query[route.primaryKey])
   {  
       if(validateGet(req.query))
       {
           sql += ` WHERE ${route.primaryKey}=$${++num} FETCH FIRST 1 ROWS ONLY`
           params.push(req.query[route.primaryKey])
        
           /*res.status(dbRes.rows == 0 ? 404 : 200)
           res.json({result: dbRes.rows})
           return;*/
       }
       else
       {
           res.status(400)
           res.json({errors: validateGet.errors})
           return;
       }
   }
   else if(req.query['client_id'])
   {
        if(validateGet(req.query))
        {
            sql += ` WHERE jc.client_id=$${++num}`
            params.push(req.query.client_id)
            
            //let dbRes = await Db.query(sql,[req.query.client_id])
            /*res.status(dbRes.rows == 0 ? 404 : 200)
            res.json({results: dbRes.rows})
            return;*/
        }
        else
        {
            res.status(400)
            res.json({errors: validateGet.errors})
            return;
        }
   }
   

    let result = []
    let inventory = []

    if(req.body.limit)
    {
        let limit = 99999
        let offset = 0

        sql += ` LIMIT $${++num} OFFSET $${++num}`

        if(req.body.limit)
            limit =  req.body.limit
        
        if(req.body.offset)
            offset = req.body.offset
        
       params.push(limit,offset)
    }

    let client = await Db.connect()
    
    try{
        await client.query('BEGIN')
        result = (await client.query(sql,[...params])).rows

       // let sql2 = `SELECT * FROM inventory_nd_project `
        /*let params2 = []

        if(req.body['project_id'])
        {
            sql2 += `WHERE ${req.body['project_id']} = $1`
            params2.push(req.body['project_id'])
        }*/
       // inventory = (await client.query(sql2)).rows

        console.log()
    }
    catch (e) {
        await client.query('ROLLBACK')
        throw e
    }

    finally {
        client.release()
    }
    

    /*let inv = inventoryToObj(inventory)
    console.log(inv)

    for(let i=0; i < result.length; i++)
    {
        let products_headings = result[i].products_headings
        for(let j=0; j < products_headings.length; j++)
        {
            let pItems =  result[i].products_headings[j].pItems
            for( let k = 0; k < pItems.length; k++)
            {
                result[i]['products_headings'][j]['pItems'][k].inStock = 0
                if(inv[result[i].project_id ][pItems[k].pid])
                {
                    //pItems[k].quantity
                    result[i]['products_headings'][j]['pItems'][k].inStock = inv[ result[i].project_id ][pItems[k].pid]
                }

               // console.log(result[i]['products_headings'][j]['pItems'][k].pid)
            }
        }
    }
    

    console.log(JSON.stringify(result))
    */
    
    /*
    let temp = {}

    for( i of result )
    {
        let project_id = Number(i.project_id)
        for( j of i.products_headings )
        {
            for( k of j.pItems )
            {
              
                if(!temp[i.project_id])
                {
                    
                    temp[project_id] = {}
                   
                }
                

                if(!temp[i.project_id][k.pid])
                    temp[i.project_id][k.pid] = 0

                temp[project_id][k.pid] += Number(k.quantity)

            }
        }
    }*/




    
    //console.log(sql)
    //console.log(JSON.stringify(temp,'',2))

  /*

    for( project of Object.keys(temp) )
    {
        
        for( product of Object.keys(temp[project]) )
        {
            if(temp[project][product] && inv[project][product] )
            {
                inv[project][product] = inv[project][product] - temp[project][product]
            }
        }
    }
    */
    
    
    //console.log('inv -> '+JSON.stringify(inv))

    //console.log(JSON.stringify(result,'',2))


    
    
    res.status(200).json({results:  result})
     
}))



Router.post('/', Handler.Bless(async (req,res,next) => {

    if(req.body.products_headings)
        req.body.products_headings = JSON.parse(req.body.products_headings)

    if(validatePost(req.body))
    {
      
        let { products_headings, ...jc_items } = req.body

        let queryRes = await Db.query(`
        INSERT INTO ${route.table}
        (
            client_id,
            project_id,
            person_id,

            location,
            revision,
            site_supervisor,
            autocad_engineer,
            plan_approved_by,
            labour_contractor,
            products_headings

        )
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        )
        RETURNING ( jobcard_id )
        `,[
            req.body.client_id,
            req.body.project_id,
            req.body.person_id,
            req.body.location,
            req.body.revision,
            req.body.site_supervisor,
            req.body.autocad_engineer,
            req.body.plan_approved_by,
            req.body.labour_contractor,
            JSON.stringify(req.body.products_headings)
        ])


    

        res.json({
            results: queryRes.rows,
            rowsAffected: queryRes.rowCount

        })

        
        }
        else
            res.status(400).json({  
                result: false,
                errors: validatePost.errors
            })

}))


function inventoryToObj(data){
    let temp = {}
    for( i of data )
    {
        //console.log(i.product_id)
        if(!temp[i.project_id])
            temp[i.project_id] = {}

        if(!temp[i.project_id][i.product_id])
            temp[i.project_id][i.product_id] = 0

        temp[i.project_id][i.product_id] += i.stock
    }

   // console.log(data)

    return temp
}


function generateNewInserts(table,p_headings,ret){

    if(!table || !p_headings || !ret)
        return ''


    //console.log(`Headings -> ${JSON.stringify(p_headings)}`)

        
    let sql = SQL`INSERT INTO jc_headings( heading, subheading, temp ) VALUES`

    p_headings.items.forEach( (k,i,a) => {

        sql.append(SQL` (${k[0]}, ${k[1]}, ${i})`)
        sql.append(`${ i < a.length-1 ? ',' : ' ' }`)

    } )


    sql.append(`RETURNING ${ret}`)

    //console.log(`SQL ${sql.text} Values= ${sql.values}`)
    
    return sql
}


Router.patch('/', Handler.Bless(async (req,res,next) => { 

    if(req.body.products_headings)
        req.body.products_headings = JSON.parse(req.body.products_headings)
    if(validatePatch(req.body) )
    {
        
        let queryObj = generatePatchQuery(req.body)
        let queryRes = await Db.query(queryObj.sql,queryObj.params)

        

        let temp = {}

        if(queryRes.rowCount <= 0) {
            res.status(404)
            temp.rowsAffected = false
            temp.message = 'Nothing was changed.'
        }
        else
        {
            temp.rowsAffected = queryRes.rowCount
            temp.message = `Successfully updated ${queryRes.rowCount} row with ${route.primaryKey} ${queryRes.rows[0][route.primaryKey]}`
            res.status(200)
        }
            
        res.json(temp)
    }
    else

    {

        res.status(400).json({
            result: false,  
            errors: validatePatch.errors,
        })

    }

}))

Router.delete('/', Handler.Bless(async (req,res,next) => {
    if(validateDelete(req.body))
    {
        let queryRes = await Db.query(`DELETE FROM ${route.table} WHERE ${route.primaryKey} = $1 RETURNING *`,[req.body[route.primaryKey]])
        let temp = {}

        if(queryRes.rowCount <= 0) {
            res.status(404)
            temp.rowsAffected = false
            temp.message = 'Nothing was changed.'
        }
        else
        {
            temp.rowsAffected = queryRes.rowCount
            temp.message = `Successfully deleted ${queryRes.rowCount} row with ${route.primaryKey} ${queryRes.rows[0][route.primaryKey]}`
            res.status(200)
        }

        res.json(temp)

    }
    else
        res.status(400).json({
            result: false,  
            errors: validateDelete.errors,
        })
    

}))


function generatePatchQuery(input){

    let sql = `UPDATE ${route.table} SET`
    let tempArr = []
    let cleanObj =  extras.filterSchema(route.columns,input,[route.primaryKey])

    //inputKeys.splice(inputKeys.indexOf('project_id'),1)

    //console.log(cleanObj)
   

    Object.keys(cleanObj).forEach( (k,i,a) => { 
            

            //console.log(k)
            if(k == 'products_headings')
            {
                tempArr.push(JSON.stringify(cleanObj[k]))
                sql += ` ${k} = $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
            }
            else
            {
                tempArr.push(cleanObj[k])
                sql += ` ${k} =  $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
            }
                



    } )

    tempArr.push(input[route.primaryKey])
    sql += ` WHERE ${route.primaryKey} = $${tempArr.length} RETURNING *`

    console.log(`SQL -> ${sql}`)
    return {sql: sql, params: tempArr}

}




module.exports = Router



/*

    latest

    SELECT project.name AS project_name, person.name AS person_name, client.name AS client_name,s.* FROM 
     
     (
	
        SELECT 
            jobcard_id,
            client_id,
            project_id,
            jsonb_build_object(
                'products',
                json_agg(p_items)
            )->'products' as products_headings, 
            location,
            revision, 
            date,
            site_supervisor,
            autocad_engineer,
            plan_approved_by,
            labour_contractor,
            person_id
                    
        FROM
        (
                SELECT 
                    jc.jobcard_id,client_id, jc.project_id,
                    jc.location,revision, date,
                    site_supervisor,
                    autocad_engineer,
                    plan_approved_by,
                    labour_contractor,
                    person_id,
                    jsonb_build_object(
                        'heading', heading_elems -> 'heading',
                        'subheading', heading_elems -> 'subheading',
                        'pItems', json_agg(elems || jsonb_build_object('product_name', po.name,'site_stock',NULLIF(site.stock,0),'global_stock',NULLIF(g.stock,0)))
                    ) AS p_items
                    
                FROM jobcards jc CROSS JOIN LATERAL
                    jsonb_array_elements(jc.products_headings) AS heading_elems CROSS JOIN LATERAL
                    jsonb_array_elements(heading_elems -> 'pItems') AS elems CROSS JOIN LATERAL
					(SELECT stock FROM inventory_nd_product WHERE product_id =  (elems->> 'pid')::int ) AS g CROSS JOIN LATERAL
					(SELECT stock FROM inventory_nd_project WHERE product_id = (elems->>'pid')::int AND project_id=jc.project_id ) AS site
                    JOIN products po ON (elems ->> 'pid' )::int = po.product_id
                    
                    
                    GROUP BY  jobcard_id,client_id, jc.project_id, heading_elems,  location ,revision, date,
                    site_supervisor,
                    autocad_engineer,
                    plan_approved_by,
                    labour_contractor,
                    person_id
                    
                    
        ) s
        GROUP BY    jobcard_id, client_id,
                    project_id, location,
                    revision, date,
                    site_supervisor,
                    autocad_engineer,
                    plan_approved_by,
                    labour_contractor,
                    person_id
                    
    ) s
    
    
    INNER JOIN clients client ON client.client_id = s.client_id
    INNER JOIN projects project on project.project_id = s.project_id 
    INNER JOIN persons person on person.person_id = s.person_id 

*/