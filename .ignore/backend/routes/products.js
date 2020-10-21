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
    table : 'products',
    primaryKey: 'product_id',
    columns : [
        'product_id',
        'brand',
        'type',
        'name',
        'unit_id',
        'description',
     //   'ref_no',
        'igst',
        'cgst',
        'sgst',
        'hsn_code'
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


   let sql = `SELECT         
                product_id, product.name as name, brand, description , type , product.unit_id as unit_id , unit.name as unit_name, ref_no,
                igst, cgst, sgst , hsn_code
                FROM ${route.table} product
                INNER JOIN units unit ON unit.unit_id = product.unit_id
                
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
    sql += ` ORDER BY product.product_id DESC LIMIT $1 OFFSET $2`

    if(req.body.limit)
        limit =  req.body.limit
    
    if(req.body.offset)
        offset = req.body.offset

    //console.log(sql)
    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))


Router.get('/jsonb', Handler.Bless(async (req,res,next) => {


    let sql = `SELECT   
                    jsonb_build_object(      
                        'product_id', product_id , 
                        'name', product.name , 
                        'brand', brand, 
                        'description', description , 
                        'type', type , 
                        'unit_id', product.unit_id,
                        'unit_name' ,unit.name, 
                        'ref_no', ref_no,
                        'igst',igst,
                        'cgst', cgst,
                        'sgst,sgst
                    )
                    
                    FROM ${route.table} product
                    INNER JOIN units unit ON unit.unit_id = product.unit_id
                 
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
     sql += `LIMIT $1 OFFSET $2`
 
     if(req.body.limit)
         limit =  req.body.limit
     
     if(req.body.offset)
         offset = req.body.offset
 
     //console.log(sql)
     res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
     
 }))
Router.post('/', Handler.Bless(async (req,res,next) => {

    if(validatePost(req.body))
    {

        let fColumn = route.columns.filter( (k,i,a) => {
            return req.body[k] 

        } )
            
        let params = []
        fColumn.forEach( (k,i,a) => params.push(req.body[k]) )

        // generate dynamic query 
        let sql =`INSERT INTO ${route.table}
        ( ${ fColumn.filter( k => k != route.primaryKey).join(',')} ) 
        VALUES(${fColumn.reduce( (p,k,i,a) => p + ` $${i+1} ${i+1 <= a.length-1 ? ', ' : ' ' } `,'')}) RETURNING *`

    
        //console.log(sql)

        let queryRes = await Db.query(sql,
            params)
        
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