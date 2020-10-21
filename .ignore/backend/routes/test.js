console.log(`P_HEADINGS -> ${JSON.stringify(p_headings)}`)
    
        //console.log(`Headings -> ${JSON.stringify(p_headings)}, Products -> ${JSON.stringify(p_products)}`)

        //console.log(` Product Headings -> ${JSON.stringify(productHeadings)} `)
        // TRANSACTIONS

        
        const client =  await Db.connect()
        
        try {
            //console.log(filteredJobcards)
            await client.query('BEGIN')
            let res_jc = `
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
                    labour_contractor

                )
                VALUES(
                    ${req.body.client_id},
                    ${req.body.project_id},
                    ${req.body.person_id},

                    ${req.body.location},
                    ${req.body.revision},
                    ${req.body.site_supervisor},
                    ${req.body.autocad_engineer},
                    ${req.body.plan_approved_by},
                    ${req.body.labour_contractor}
                )
                RETURNING (jobcard_id)
            `
            //console.log(res_jc)

            

            p_headings.items.forEach(async (k,i,a) =>{

                //console.log(JSON.stringify(k))
                let headings_values = p_headings.keys
                
                //k.map( kk => kk == null ? '' : kk  ) 
                let res_heading = {rowCount: 5,head_id: 1} /*await client.query(`
                    INSERT INTO jc_headings(heading,subheading) VALUES(1$,$2) RETURNING head_id`,
                    headings_values
                )*/
                
                if( res_heading.rowCount > 0 )
                {
                    let per_product = p_headings.products[i]

                    let per_product_obj = 
                    {
                        sql :   `INSERT INTO jc_product (head_id,product_id,quantity)
                                VALUES($1,$2,$3)
                                `,
                        params: [res_heading.head_id,per_product.pid,per_product.quantity]
                    }

                    let jc_pro_id = 1

                    let taxonomy = {
                        sql : `
                        INSERT INTO jc_taxonomy(head_id,jc_pro_id,jobcard_id)`,
                        params: [ res.heading.head_id, jc_pro_id,  res_jc.rows[0].jobcard_id ]
                    }

                    console.log(`PER PRODUCT -> ${JSON.stringify(per_product_obj)}`)
                
                }


                
                //console.log(res_heading + ' arr - '+arr)
            } )
    
            //await client.query('END')
        }
        catch (e) {
           // await client.query('ROLLBACK')
            throw e
        } 
        finally 
        {
            //await client.release()
        }
    

        /*res.json({
            heading: p_headings,
            prodcuts : p_products
        })*/

        //let filteredHeadings = extras.filterSchema(productHeadings)

      /*  let result = p_headings.items.reduce( (acc,k,i,a) =>     
            {
               // console.log('in k -> '+k)
                return  acc + generateValue(k,i,p_headings.items.length )
            }, '' 
        )*/



        /*let sql = `
            WITH op1 AS {
                INSERT INTO  jobcards(${Object.keys(filteredJobcards)}) VALUES()    
            },
            WITH op2 AS {
                INSERT INTO jc_headings( ${p_headings.keys.join(',')} ) 
                    ${ p_headings.items.reduce( (acc,k,i,a) => acc + generateValue(k,i,p_headings.items.length ), ''
                     ) } 
                RETURNING head_id
            }, op3 AS {
                INSERT INTO jc_product ( ${p_products.keys.join(',')} ) VALUES(${generateValues()}) RETURNING jc_pro_id
            }, op4 AS {
                INSERT INTO jc_taxonomy ( ${generateKeys()} )  VALUES(${generateValues()})
            }
        
        ` */



         //console.log(sql)
/*
        `, op3 AS {
            INSERT INTO jc_product ( ${p_products.keys.join(',')} ) VALUES(${generateValues()}) RETURNING jc_pro_id
        }, op4 AS {
            INSERT INTO jc_taxonomy ( ${generateKeys()} )  VALUES(${generateValues()})
        },`*/

       

        //console.log(sql)

       /* let sql = SQL`WITH op1 AS {
                    INSERT INTO  jobcards($keys${Object.keys(filteredJobcards)}) 
                    $values${filteredJobcards}   
                },
                WITH op2 AS {
                    ${generateNewInserts('jc_headings',p_headings,'head_id, temp')}
                    , op3 AS {
                        INSERT INTO jc_product ( ${p_products.keys.join(',')} ) VALUES() RETURNING jc_pro_id
                    }, op4 AS {
                        INSERT INTO jc_taxonomy ( ${generateKeys()} )  VALUES()
                    }
                `
        */



        //console.log(sql.text.replace('\n',''))
        
        
        /*let queryRes = await Db.query(sql,
            [
            req.body.brand,
            req.body.type,
            req.body.name,
            req.body.unit_id,
            req.body.description,
            req.body.ref_no
            ])
        
        
        
        res.json({
            results: queryRes.rows,
            rowsAffected: queryRes.rowCount

        })
        */





stock





products : [
    {
        pid: 4,
        delivery_address : 5 /* godown id */,
        qty: 555,
        rate: 5.55,
        igst: 18,
        cgst: 18,
        sgst: 0,

    }
]



// enum
enum

inventory_type
  direct
  main godown
  stock transfer

designation_enum
  mr
  mrs
  ms
  miss

po_status
 pending
 approved
 cancelled

pro_dim
 mm
 inch

pro_type
 purchase
 selling
 trade

project_type
 commercial
 residential
 industrial

tac_test_cert
 website

tax_type
 All Inclusive in price
 GST extra as applicable 
 GST as mentioned

freight_tax
  Inclusive
  Extra at actual
