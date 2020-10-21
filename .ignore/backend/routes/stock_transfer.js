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
    table : 'stock_transfer',
    primaryKey: 'st_id',
    columns : ['st_id','sender','receiver','reason','status','transfers']
    
}





const validatePost = ajv.compile(schemas[route.table].POST)
const validateGet = ajv.compile(schemas[route.table].GET)
const validatePatch = ajv.compile(schemas[route.table].PATCH)
const validateDelete = ajv.compile(schemas[route.table].DELETE)
const validateAccept = ajv.compile(schemas[route.table].ACCEPT)



Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table} `)).rows[0].count }
) ))


Router.get('/', Handler.Bless(async (req,res,next) => {


   let sql = `
    SELECT st.*,
    g.name AS sender_name,
    gg.name AS receiver_name
    FROM ${route.table} st
    INNER JOIN projects g ON st.sender = g.project_id
    INNER JOIN projects gg ON st.receiver = gg.project_id
   
   
   `
    
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
    sql += `ORDER BY st.st_id DESC LIMIT $1 OFFSET $2`

    if(req.body.limit)
        limit =  req.body.limit
    
    if(req.body.offset)
        offset = req.body.offset

    //console.log(sql)
    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))

Router.post('/', Handler.Bless(async (req,res,next) => {

    req.body.transfers = JSON.parse(req.body.transfers)

    if(validatePost(req.body))
    {

        // generate dynamic query 
        let sql =`INSERT INTO ${route.table}
        ( sender, receiver, reason, transfers ) 
        VALUES($1,$2,$3,$4) RETURNING *`

        //console.log(sql)

        let queryRes = await Db.query(sql,
            [
            req.body.sender,
            req.body.receiver,
            req.body.reason,
            JSON.stringify(req.body.transfers)
            
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

Router.patch( '/accept/:st_id', Handler.Bless( async (req,res,next) => {

   

    if(validateAccept(req.params))
    {
        let initialResult = await Db.query(`SELECT * FROM ${route.table} WHERE st_id=$1`,[req.params.st_id])
        let initial = initialResult.rows[0]
        if(initial.status)
        {
            res.status(200).json({
                status: 'Nothing changed'
            })
        }
        else
        {
            /*let updateResult = await Db.query(`
            
            WITH res AS (
                UPDATE ${route.table} SET status=TRUE WHERE st_id=$1 RETURNING * 
            ),
             cte AS jsonb_array_elements( res.transfers ) ,
            
             q as ( 

                INSERT INTO inventory(stock, unit_id, avg_rate, inventory_type, godown_id, 
                    product_id
                )

                VALUES( cte.stock, cte.unit_id, cte.avg_rate, cte.inventory_type,
                        cte.godown_id,
                        cte.product_id
                )

              )

            
            
            `,[req.params.st_id])*/


            const client = await Db.connect()
            
            let errored = false

            try {
                await client.query('BEGIN')
                const { rows } = await client.query(`UPDATE ${route.table} SET status=TRUE WHERE st_id=$1 RETURNING *`, [req.params.st_id])
                

                for(k of rows[0].transfers)
                {
                   await client.query(`
                    
                    INSERT INTO inventory(
                        
                        stock,
                        product_id,
                        type,
                        project_id,
                        avg_rate
                        
                        )
    
                    VALUES( $1, $2, $3, $4, $5 )
                    

                    `, [(k.stock)*-1, 
                        k.product_id,
                        2,
                        initial.sender,
                        k.avg_rate])

                    await client.query(`
                    
                    INSERT INTO inventory(                        
                        stock,
                        product_id,
                        type,
                        project_id,
                        avg_rate
    
                    )
    
                    VALUES( $1, $2, $3, $4,
                            $5
                    )
                    

                    `, [k.stock, 
                        k.product_id,
                        2,
                        initial.receiver,
                        k.avg_rate])
                }

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
                        result: 'Success'
                    })
                else
                    res.status(500).json({
                        error: 'Something Went Wrong'
                    })
            }



        }
    }
    
} ) )


Router.patch('/', Handler.Bless(async (req,res,next) => { 

    if(req.body.transfers)
     req.body.transfers = JSON.parse(req.body.transfers)
    if(validatePatch(req.body) )
    {
        
        if(req.body.transfers)
            req.body.transfers = JSON.stringify(req.body.transfers)
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


    Object.keys(cleanObj).forEach( (k,i,a) => { 

            
            tempArr.push(cleanObj[k])
            sql += ` ${k} =  $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
    } )

    tempArr.push(input[route.primaryKey])
    sql += ` WHERE ${route.primaryKey} = $${tempArr.length} RETURNING *`

    return {sql: sql, params: tempArr}
}




module.exports = Router