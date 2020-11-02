//const express = require('express')
const helmet = require('helmet')


const config = {
       contentSecurityPolicy: {
              directives: {
                     defaultSrc: ["'self'"],
                     styleSrc: ["'self'","'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"  ],
                     scriptSrc: ["'self'","'unsafe-inline'"],
                     imgSrc: ["'self'","data:","https:"],
                     connectSrc: ["'self'","'eejrecruitment.com'" ],
			fontSrc: ["'self'","https://fonts.gstatic.com","https://cdn.jsdelivr.net"]
              }
              
       },
       crossdomain: true,
       expectCt: true,
       featurePolicy: {
              features: {
                     notifications: ["'self'"]
              }
       },
       hpkg: true,
       noCache: true,
       referrerPolicy: true
}

module.exports = helmet(config)
