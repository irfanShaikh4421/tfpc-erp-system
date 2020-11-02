const Express = require('express')
const Router = Express.Router()
const Handler = require('../utilities/error')
const Db = require('../db/connect')

const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})
require('ajv-keywords')(ajv)
const schemas = require('../config/schemas')

const SQL = require('sql-template')
const extras = require('../utilities/extras')



// per route config

const route = 'clients';
const columns = [
    'client_id',
    'name',
    'state',
    'address',
    'gst_no',
    'project_type'
]


const validatePost = ajv.compile(schemas.clients.POST)
const validateGet = ajv.compile(schemas.clients.GET)
const validatePatch = ajv.compile(schemas.clients.PATCH)
const validateDelete = ajv.compile(schemas.clients.DELETE)

let count = 0






Router.get('/',  Handler.Bless(async (req,res,next) => {

    /*if(validateGet)
    {
        let dbRes = await Db.query(`SELECT * FROM ${route} WHERE client_id=$1 FETCH FIRST 1 ROWS ONLY`,[req.body.client_id])

        dbRes.rowCount <= 0 ?  res.status(404) :  res.status(200) // status
        res.json({result: dbRes.rows}) // result

    }
    else
    {
        res.status(400).json({  
            errors: validateGet.errors
        })
    }*/

    let sql = `SELECT * FROM ${route} `

    //console.log(JSON.stringify(req.query))

    if(/*req.body['client_id']*/ req.query.client_id)
    {  
        console.log('in')
        if(validateGet(req.query))
        {


            sql += `WHERE client_id=$1 FETCH FIRST 1 ROWS ONLY`
            let dbRes = await Db.query(sql,[req.query.client_id])
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

    let limit = 10000
    let offset = 0
    sql += `ORDER BY client_id DESC LIMIT $1 OFFSET $2`

    if(req.body.limit)
    {
        limit = req.body.limit <= 30 ? req.body.limit : 30
    }
    if(req.body.offset)
        offset = req.body.offset
    res.status(200).json({results:  (await Db.query(sql,[limit,offset])).rows })

    //console.log(`This is ${++count} request`)
    
}))

Router.post('/', Handler.Bless(async (req,res,next) => {

    if(validatePost(req.body))
    {

        // generate dynamic query


        let queryRes = await Db.query(`
        
            INSERT INTO ${route}(name,state,address,gst_no,project_type) VALUES($1,$2,$3,$4,$5) RETURNING *
        
        `,[
            req.body.name,
            req.body.state,
            req.body.address,
            req.body.gst_no,    
            req.body.project_type
        ])
        
        res.json({
            results: queryRes.rows,
            rowsAffected: queryRes.rowCount

        })
    }
    else
        res.status(400).json({  
            errors: validatePost.errors
        })

}))


Router.patch('/', Handler.Bless(async (req,res,next) => { 

    if(validatePatch(req.body) )
    {
        let queryObj = generatePatchQuery(req.body)

        console.log(queryObj.sql)
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
            temp.message = `Successfully updated ${queryRes.rowCount} row with client id ${queryRes.rows[0]['client_id']}`
            res.status(200)
        }
            
        
        res.json(temp)
    }
    else

    {
    
        res.status(400).json({
            errors: validatePatch.errors,
        })

    }

}))

Router.delete('/', Handler.Bless(async (req,res,next) => {
    if(validateDelete(req.body))
    {
        let queryRes = await Db.query(`DELETE FROM ${route} WHERE client_id = $1 RETURNING *`,[req.body['client_id']])
        let temp = {}

        if(queryRes.rowCount <= 0) {
            res.status(404)
            temp.rowsAffected = false
            temp.message = 'Nothing was changed.'
        }
        else
        {
            temp.rowsAffected = queryRes.rowCount
            temp.message = `Successfully deleted ${queryRes.rowCount} row with client id ${queryRes.rows[0]['client_id']}`
            res.status(200)
        }

        res.json(temp)

    }
    else
        res.status(400).json({
            errors: validatePatch.errors,
        })
    

}))



function generatePatchQuery(input){

    
    let sql = `UPDATE clients SET`
    let tempArr = []
    let cleanObj =  extras.filterSchema(columns,input,['client_id'])

    //inputKeys.splice(inputKeys.indexOf('project_id'),1)

    //console.log(cleanObj)
   

    Object.keys(cleanObj).forEach( (k,i,a) => { 
            tempArr.push(cleanObj[k])
            sql += ` ${k} =  $${tempArr.length} ${ i < ((a.length) - 1 ) ? ', ' : ''}`
    } )

    tempArr.push(input['client_id'])
    sql += ` WHERE client_id = $${tempArr.length} RETURNING *`

    return {sql: sql, params: tempArr}
}




module.exports = Router
