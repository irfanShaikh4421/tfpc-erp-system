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
    table : 'persons',
    primaryKey: 'person_id',
    columns : [
        'person_id',
        'name',
        'email',
        'designation',
        'client_id',
        'project_id',
        'number'
    ]
    
}





const validatePost = ajv.compile(schemas[route.table].POST)
const validateGet = ajv.compile(schemas[route.table].GET)
const validatePatch = ajv.compile(schemas[route.table].PATCH)
const validateDelete = ajv.compile(schemas[route.table].DELETE)



Router.get( '/count',Handler.Bless(async (req,res,next) => res.json({
        count : (await Db.query(`SELECT COUNT(*) FROM ${route.table}`)).rows[0].count }
) ))


Router.get('/', Handler.Bless(async (req,res,next) => {

   /* if(validateGet)
    {
        let dbRes = await Db.query(`SELECT * FROM ${route} WHERE project_id=$1 FETCH FIRST 1 ROWS ONLY`,[req.body.project_id])
        res.json({result: dbRes.rowCount == 0 ? false : dbRes.rows})
    }
    else
        res.json({  
            result: false,
            errors: validateGet.errors
        })
    */

   let sql = `SELECT 
                p.person_id,p.name,p.email,p.designation,c.name as client_name , 
                project.name as project_name,
                project.project_id as project_id,
                c.client_id as client_id, p.number
                
                FROM ${route.table} p
                INNER JOIN clients c ON p.client_id = c.client_id
                INNER JOIN projects project ON p.project_id = project.project_id
   `
    
   if(req.query[route.primaryKey])
   {  
       if(validateGet(req.query))
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
            sql += `WHERE p.project_id=$1`
            let dbRes = await Db.query(sql,[req.query.project_id])
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
   else if(req.query['client_id'])
   {
        if(validateGet(req.query))
        {
            sql += `WHERE p.client_id=$1`
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
    sql += ` ORDER BY p.person_id DESC  LIMIT $1 OFFSET $2`

    if(req.query.limit)
        limit =  req.body.limit
    
    if(req.query.offset)
        offset = req.body.offset

    //console.log(sql)
    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })
    
}))

Router.post('/', Handler.Bless(async (req,res,next) => {

    if(validatePost(req.body))
    {

        // generate dynamic query 
        let sql =`INSERT INTO ${route.table}
        ( ${ route.columns.filter( k => k != route.primaryKey).join(',')} ) 
        VALUES($1,$2,$3,$4,$5,$6) RETURNING *`

        //console.log(sql)

        let queryRes = await Db.query(sql,
            [
            req.body.name,
            req.body.email,
            req.body.designation,
            req.body.client_id,
            req.body.project_id,
            req.body.number
        ])
        
        //console.log(queryRes)

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
