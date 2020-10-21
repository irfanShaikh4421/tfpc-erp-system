const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true,removeAdditional: 'all'})
require('ajv-keywords')(ajv)

const schemas = require('../config/schemas')
const extras = require('../utilities/extras')
const SQL = require('sql-template-strings')

const moment = require('moment')



// per route config

const route = {
    table : 'purchase_orders',
    primaryKey: 'po_id',
    columns : [
        'po_id',
        'ref',
        'subject',
        'tac_id',
        'vendor_id',

        'date'
    ]
    
}




const validatePost = ajv.compile(schemas[route.table].POST)
const validateGet = ajv.compile(schemas[route.table].GET)
const validatePatch = ajv.compile(schemas[route.table].PATCH)
const validateDelete = ajv.compile(schemas[route.table].DELETE)
const validateDelivery = ajv.compile(schemas[route.table].DELIVERY)



Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))


Router.get('/', Handler.Bless(async (req,res,next) => {

    /*
    jsonb_build_object(
                    'product_id', po.product_id,
                    'product_name', pro.name,
                    'quantity', po.quantity,
                    'delivered', po.delivered,
                    'avg_rate', po.avg_rate
                    
                )
    */


   let sql = `SELECT jc.*,
                v.name AS vendor_name,
                v.address AS vendor_address,
                jsonb_build_object(
                    'tax_type', t.tax_type,
                    'tax_price', t.tax_price,
                    'warranty', t.warranty,
                    'payment', t.payment,
                    'delivery_period', t.delivery_period,
                    'freight_tax', t.freight_tax,
                    'remarks', t.remarks 
                ) AS tac,
                (
                    
                        SELECT jsonb_agg(  q ) 
                        FROM (SELECT po.*, pro.name AS product_name,
                                p.site_address, p.name,
                                pro.igst,
                                pro.cgst,
                                pro.sgst,
                                u.name

                                FROM
                                po_products po 
                                INNER JOIN
                                products pro ON pro.product_id = po.product_id
                                INNER JOIN 
                                projects p ON p.project_id = po.project_id

                                INNER JOIN 
                                units u ON pro.unit_id = u.unit_id

                                WHERE po.po_id = jc.po_id) q

                                
                
                    
            
                ) AS products

                FROM ${route.table}  jc

                INNER JOIN vendors v ON  jc.vendor_id =  v.vendor_id 
                INNER JOIN tac t ON jc.tac_id = t.tac_id
                

                `
    
   if(req.query[route.primaryKey])
   {  
       if(validateGet(req.query))
       {
           sql += `WHERE jc.${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
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

    let limit = 99999
    let offset = 0
    sql += ` ORDER BY jc.po_id DESC LIMIT $1 OFFSET $2`

    if(req.body.limit)
        limit =  req.body.limit
    
    if(req.body.offset)
        offset = req.body.offset
    

    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))


Router.post('/', Handler.Bless(async (req,res,next) => {

    req.body.products = JSON.parse(req.body.products)
    req.body.tac = JSON.parse(req.body.tac)


    if(validatePost(req.body))
    {
      
        let { products_headings, ...jc_items } = req.body

        let queryRes = await Db.query(`

        WITH tac_cte AS (
            INSERT INTO tac( tax_type, tax_price, warranty,
                payment, delivery_period, freight_tax,
                remarks, additional_remarks )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
                
            )
            RETURNING tac_id
        ),
        insert_po AS (
            INSERT INTO ${route.table}
            (
                ref,
                subject,
                tac_id,
                vendor_id,
                date
            )
            VALUES(
                $9,
                $10,
                (SELECT tac_id FROM tac_cte),
                $11,
                $12
                
            )
            RETURNING ( po_id )
        ),
        normalized_data AS(
            SELECT quantity, delivered, product_id, project_id, avg_rate, po_id
            FROM jsonb_to_recordset($13) as products(quantity numeric(12,2), delivered numeric(12,2), product_id int, project_id int, avg_rate numeric(12,2))
            CROSS JOIN insert_po

        )
        INSERT INTO po_products(product_id, project_id, quantity, avg_rate, delivered, po_id)
        SELECT product_id, project_id, quantity, avg_rate, delivered, po_id
        FROM normalized_data
       
        
        


        `,[
            req.body.tac.tax_type,
            req.body.tac.tax_price,
            req.body.tac.warranty,
            req.body.tac.payment,
            req.body.tac.delivery_period,
            req.body.tac.freight_tax,
            req.body.tac.remarks,
            req.body.tac.additional_remarks,

            req.body.ref,
            req.body.subject,
            req.body.vendor_id,
            req.body.date,
            JSON.stringify(req.body.products)
            
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



Router.patch('/', Handler.Bless(async (req,res,next) => { 

    if(req.body.products)
        req.body.products = JSON.parse(req.body.products)
    
    if(req.body.tac)
        req.body.tac = JSON.parse(req.body.tac)
  

    if(validatePatch(req.body) )
    {
        
        let client = await Db.connect()
        
        let temp = {}
        
        let queryRes
        try {
            await client.query('BEGIN')
            const queryText = 
            `UPDATE tac SET tax_type = $1, tax_price = $2, 
                warranty = $3,
                payment = $4,
                delivery_period = $5,
                freight_tax = $6,
                remarks = $7

            WHERE tac_id =  $8
            `
            
            
            const { rows } = await client.query(queryText, [
                req.body.tac.tax_type,
                req.body.tac.tax_price,
                req.body.tac.warranty,
                req.body.tac.payment,
                req.body.tac.delivery_period,
                req.body.tac.freight_tax,
                req.body.tac.remarks,
                req.body.tac_id
            ])

            console.log('tac -> '+rows)

            req.body.products.forEach( (k,i,a) => {
                if(k.delivered || k.delivered == 0)
                    k.delivered = 0
            } )

            //console.log(req.body.products)

            let queryObj = generatePatchQuery(req.body)
            queryRes = await client.query(queryObj.sql, queryObj.params)

        
            let productsRes = await client.query( `SELECT update_po_productss($1,$2)`, [JSON.stringify(req.body.products),queryRes.rows[0].po_id] ) 

            temp = productsRes.rows


            await client.query('COMMIT')
          } catch (e) {
            await client.query('ROLLBACK')
            throw e
          } finally {
            client.release()
          }

        

        

        

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


Router.patch('/delivery', Handler.Bless(async (req,res,next) => { 

    if(req.body.products)
        req.body.products = JSON.parse(req.body.products)
  

    if(validateDelivery(req.body) )
    {
        
        let client = await Db.connect()
        
        let temp = {}
        
        let queryRes
        try {
            await client.query('BEGIN')
        
            let sql = `
               SELECT * FROM po_to_inventory($1,$2)
            `

            queryRes = await  client.query(sql,[JSON.stringify(req.body.products),req.body.po_id])

        


            await client.query('COMMIT')
          } catch (e) {
            await client.query('ROLLBACK')
            throw e
          } finally {
            client.release()
          }

        

        

        

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
            
        res.json(queryRes)
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
            if(k == 'products')
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