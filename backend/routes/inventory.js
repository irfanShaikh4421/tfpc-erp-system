const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})
require('ajv-keywords')(ajv)

const schemas = require('../config/schemas')
const extras = require('../utilities/extras')



// per route config

const route = {
    table : 'inventory',
    primaryKey: 'inventory_id',
    columns : ['inventory_id',
                'stock',
                'project_id',
                'avg_rate',
                'type',
                'product_id']
    
}





const validatePost = ajv.compile(schemas[route.table].POST)
const validateGet = ajv.compile(schemas[route.table].GET)
const validatePatch = ajv.compile(schemas[route.table].PATCH)
const validateDelete = ajv.compile(schemas[route.table].DELETE)
const validateAccept = ajv.compile(schemas[route.table].ACCEPT)
const validatePoDelivery = ajv.compile(schemas[route.table].PO)



//overall


Router.get('/productWise', Handler.Bless(async (req,res,next) => {

    let sql = 
         `SELECT * FROM inventory_w_jobcards_product
 
         `
 
        // console.log(sql)
     
 
     let limit = 999999
     let offset = 0
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))

Router.get('/projectWise/:project_id', Handler.Bless(async (req,res,next) => {

  /*  let sql = 
         `SELECT * FROM jobcard_w_inventory_product 
         `
*/
	let sql = ` SELECT * FROM inventory_w_jobcards  `

    if(req.params['project_id'])
    {  
             if(validateGet(req.query))
             {
                 sql += `WHERE project_id=$1`
                 let dbRes = await Db.query(sql,[req.params['project_id']])
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
     
 
     let limit = 999999
     let offset = 0
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))




Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))


Router.get('/', Handler.Bless(async (req,res,next) => {

   let sql = 
        `SELECT 

            inventory_id, 
            stock,
            avg_rate,
            inventory.type ,
            inventory.product_id,
            project.name as project_name,
            project.godown_name,
            product.name as product_name

        FROM ${route.table} inventory
        INNER JOIN projects project ON inventory.project_id = project.project_id
        INNER JOIN products product ON product.product_id = inventory.product_id
        

        `

       // console.log(sql)
    
   if(req.body[route.primaryKey])
   {  
       if(validateGet(req.body))
       {
           sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
           let dbRes = await Db.query(sql,[req.body[route.primaryKey]])
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
    sql += `LIMIT $1 OFFSET $2`

    if(req.body.limit)
        limit =  req.body.limit
    
    if(req.body.offset)
        offset = req.body.offset

    console.log(sql)
    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))

Router.get('/product/:product_id', Handler.Bless(async (req,res,next) => {

    let sql = 
         `SELECT 
            
            i.*,
            pro.name as product_name,
            proj.name as project_name,
            it.name as inventory_type
         
            FROM inventory i
            INNER JOIN products pro ON pro.product_id = i.product_id
            INNER JOIN projects proj ON proj.project_id = i.project_id
            INNER JOIN inventory_types it ON it.id = i.type
            
         `
 
        // console.log(sql)
     
    /*if(req.body[route.primaryKey])
    {  
        if(validateGet(req.body))
        {
            sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
            let dbRes = await Db.query(sql,[req.body[route.primaryKey]])
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
    }*/

    console.log(req.params)
    console.log(req.query)
    if(req.params['product_id'])
    {  
        if(validateGet(req.query))
        {
            sql += `WHERE i.product_id=$1`
            let dbRes = await Db.query(sql,[req.params['product_id']])
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
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))


Router.get('/project', Handler.Bless(async (req,res,next) => {

    let sql = 
         `SELECT * FROM inventory_nd_project `
 
        // console.log(sql)
     
    if(req.body[route.primaryKey])
    {  
        if(validateGet(req.body))
        {
            sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
            let dbRes = await Db.query(sql,[req.body[route.primaryKey]])
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

    else if(req.query['project_id'])
    {  
        if(validateGet(req.query))
        {
            sql += `WHERE project_id=$1`
            let dbRes = await Db.query(sql,[req.query['project_id']])
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
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))

Router.get('/product', Handler.Bless(async (req,res,next) => {

    let sql = 
         `SELECT * FROM inventory_nd_product `
 
        // console.log(sql)
     
    if(req.body[route.primaryKey])
    {  
        if(validateGet(req.body))
        {
            sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
            let dbRes = await Db.query(sql,[req.body[route.primaryKey]])
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

    else if(req.query['project_id'])
    {  
        if(validateGet(req.query))
        {
            sql += `WHERE project_id=$1`
            let dbRes = await Db.query(sql,[req.query['project_id']])
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
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))

Router.get('/distinct/product', Handler.Bless(async (req,res,next) => {

 
    let sql = 
         `
        SELECT s.*, (s.stock*s.avg_rate) AS total_amount FROM (

        SELECT   
        DISTINCT ON (inventory.product_id)
            inventory_id, 
            (SELECT SUM(i.stock) FROM inventory i WHERE i.product_id=inventory.product_id) AS stock,
            avg_rate,
            inventory.type ,
            inventory.product_id,
            inventory.project_id,
            project.name as project_name,
            project.godown_name,
            product.name as product_name


        FROM ${route.table} inventory
        
        

        INNER JOIN projects project ON inventory.project_id = project.project_id
        INNER JOIN products product ON product.product_id = inventory.product_id
    
        
        GROUP BY inventory.inventory_id, godown_name, product.name, project.name    
        )  s
        
        `
 //
        // console.log(sql)
     
    if(req.body[route.primaryKey])
    {  
        if(validateGet(req.body))
        {
            sql += `WHERE ${route.primaryKey}=$1 FETCH FIRST 1 ROWS ONLY`
            let dbRes = await Db.query(sql,[req.body[route.primaryKey]])
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
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))

Router.post('/', Handler.Bless(async (req,res,next) => {

    if(validatePost(req.body))
    {

        // generate dynamic query 
        let sql =`INSERT INTO ${route.table}
        ( stock,project_id, avg_rate, type, product_id ) 
        VALUES($1,$2,$3,$4,$5) RETURNING *`

        //console.log(sql)

        let queryRes = await Db.query(sql,
            [
            req.body.stock,
            req.body.project_id,
            req.body.avg_rate,
            req.body.type,
            req.body.product_id
            
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

    if(validatePatch(req.body) )
    {
        
        let queryObj = generatePatchQuery(req.body)
        //console.log(queryObj)
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

Router.patch('/delivery', Handler.Bless(async (req,res,next) => { 

    if(req.body && req.body.products)
        req.body.products = JSON.parse(req.body.products)

    if(validatePoDelivery(req.body) )
    {
    
        //console.log(queryObj)
        let queryRes = await Db.query('SELECT selective_delivery($1,$2)',[req.body.po_id,JSON.stringify(req.body.products)])

        
        /*
        let temp  = {}
        temp.rowsAffected = queryRes.rowCount
        temp.message = `Successfully updated ${queryRes.rowCount} row with ${route.primaryKey} ${queryRes.rows[0][route.primaryKey]}`
        res.status(200)
        */

        if(queryRes.rows[0].selective_delivery)
        {
            res.status(200)
        }
        else
            res.status(400)
            
        res.json({})
    }
    else

    {

        res.status(400).json({
            result: false,  
            errors: validatePatch.errors,
        })

    }

}))

Router.patch('/po/:po_id', Handler.Bless(async (req,res,next) => { 

    if(validateAccept(req.params))
    {
        let { rows : iRows } = await Db.query(`
        
            SELECT * FROM purchase_orders_w_products WHERE po_id=$1
        
        `,[req.params.po_id])
    
        if(  iRows.length == 0)
        {
            res.status(404).json({
                status: 'No Such purchase Order Found'
            })
        }


        if( iRows.length > 0 && iRows[0].status)
        {
            res.status(200).json({
                status: 'Nothing changed'
            })
        }
        else
        {
            
            let temp;
            const client = await Db.connect()            
            let errored = false

            try {
                await client.query('BEGIN')
                const { rows } = await client.query(`UPDATE purchase_orders SET status=TRUE WHERE po_id=$1 RETURNING *`, [req.params.po_id])

                console.log(iRows[0].products)

                const {rows : poRes } = await client.query(`SELECT po_to_inventory($1,$2)`,
                        [   JSON.stringify(iRows[0].products),
                            req.params.po_id
                    
                         ])

                    temp = poRes 



                await client.query('COMMIT')
              } catch (e) 
              
              {
                await client.query('ROLLBACK')

                console.log(e)
            
                errored = true
             

              } finally {
                client.release()

                if(!errored)
                    res.json({
                        result: temp

                    })
                else
                    res.status(500).json({
                        error: 'Something Went Wrong'
                    })
            }



        }
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
            tempArr.push(cleanObj[k])
            sql += ` ${k} =  $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
    } )

    tempArr.push(input[route.primaryKey])
    sql += ` WHERE ${route.primaryKey} = $${tempArr.length} RETURNING *`

    return {sql: sql, params: tempArr}
}




module.exports = Router
