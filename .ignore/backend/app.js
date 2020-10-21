const Express = require('express')
const App =  new Express()

const path = require('path')

const cHelmet =  require('./utilities/secure')


//const compression = require('compression')



App.use(cHelmet)

const history = require('connect-history-api-fallback')


App.use(history({
    verbose: false,
    rewrites: [{
        from: /\api\/v1\//,
        to: function(context) {
            return context.parsedUrl.path
        }
    }]
}))


require('events').defaultMaxListeners = Infinity

// Variables

const api_path = '/api/v1/'



// essential imports

const Handler = require('./utilities/error')
const Db = require('./db/connect')


// auth

const passport = require('passport')
const session = require('express-session')

const bcrypt = require('bcrypt')
const Strategy = require('passport-local').Strategy


passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function(email,pass,done){
    try{

        let { rows } = await Db.query(`SELECT * FROM users WHERE email = $1`,[email])

        if(!rows || rows.length <= 0)
            return done(null,false)

        let r = rows[0]
    
        
        bcrypt.compare(pass,r.password)
        .then( (rr) => {
        
            if(rr)
                done(null,
                    {
                        user_id: r.user_id,
                        roles: r.roles,
                        name: r.name
                })
            else
                done(null,false)
        } )
        
    }
    catch(e)
    {
        done(e)
    }
    

}))

passport.serializeUser(function(user, done) {
done(null, user)
})

passport.deserializeUser(function(user, done) {
console.log('in deserialize \n'+JSON.stringify(user))
done(null,user)
})





// config


App.use(Express.json({
    inflate: true,
    limit: "30kb"
}))


App.use(Express.urlencoded({
    extended: true
}))


App.use(session({
   // store: session.MemoryStore,
    name: 'browserAgent',
    secret: ';2.xhjsu@f2u!3e)(23u29',
    resave: true,
    saveUninitialized: false
}))

App.use(passport.initialize())
App.use(passport.session())


// middlewares

App.use(function (req, res, next) {

   
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080','http://192.168.1.6:8080','*');
  //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type-Options','nosniff')
    //res.setHeader('Content-Type','application/json'),    

    next();
});


App.all( '*', (req,res,next) => {


    if( req.method == 'OPTIONS' )
    {
        next()
        return;
    }

    let toPath = req.path.match(/\/api\/v1\/(\w+-*\w*)/)
    console.log(`path -> ${req.path} to ${toPath}`)
   /* if(!req.user )
    {
       
        if(toPath == 'login')
            next()
        else
        {
            res.status(401).json('Access Denied')
            return;
        }
       
    }
        */



    if(toPath)
    {   
        console.log('in')
        if(toPath == 'login')
        {   
            next()
            return;
        }
            
        else if(req.user)
        {
            console.log(req.user.roles)
            let keys = Object.keys(req.user.roles)

            console.log(toPath[1] + '  '+ req.user.roles[toPath[1]] + '  ' + req.method )
            if( (exception.includes(toPath[1]))  || (keys.includes(toPath[1]) && req.user.roles[toPath[1]].includes(req.method.toLowerCase()))  )
            {
                console.log('passed')
                next()
                return;
                
            }
            else
                res.status(401).json('Access Denied')
        }
        
    }

    next()
    
   // next()
} )




const Ajv = require('ajv')
const ajv = new Ajv({coerceTypes: true, allErrors: true})

const validateLogin = ajv.compile({
    email: {
        type: 'string',
        format: 'email'
    },
    password: {
        type: 'string',
        maxLength: 64
    }
})

let loginBody = (req,res,next) => {
    if(validateLogin(req.body))
        next()
    else
        req.status(500).json(validateLogin.errors)
}


App.post('/api/v1/login_f', loginBody, passport.authenticate('local'),(req,res) => {
    //console.log(req.body)
    res.json({ email : req.body.email, name: req.user.name })
})

App.get('/api/v1/isLoggedIn', (req,res) => {
    if(req.user)
    {
        res.status(200).json({status: true, name: req.user.name, email: req.user.email })
    }
    else    
        res.status(401).json({status: false})
} )


App.get('/api/v1/logout', (req,res) => {
    if(req.user)
    {
        req.logout()
        res.status(200).json({status: true})
    }
        
    else
        res.status(500).json({status: false})
} )

let exception = [
    'units',
    'isLoggedIn'

]



// routes


App.get('/',Handler.Bless(async (req,res,next) => {
    console.log('yp')
    res.sendFile('index.html', {root: __dirname})
}))

App.use(Express.static('./dist'))



const client = require('./routes/clients')
const project = require('./routes/projects')
const persons = require('./routes/persons')
const godowns = require('./routes/godowns')
const products = require('./routes/products')
const jobcards = require('./routes/jobcards')
const vendors = require('./routes/vendors')
const inventory = require('./routes/inventory')
const purchase_orders = require('./routes/purchase_orders')
const stock_transfer = require('./routes/stock_transfer')
const units = require('./routes/units')
const login = require('./auth/login')







App.use(api_path+'clients', client )
App.use(api_path+'projects', project)
App.use(api_path+'persons', persons )
App.use(api_path+'godowns', godowns ),
App.use(api_path+'products', products )
App.use(api_path+'jobcards', jobcards )
App.use(api_path+'vendors', vendors )
App.use(api_path+'inventory', inventory )
App.use(api_path+'purchase-orders', purchase_orders )
App.use(api_path+'stock-transfer', stock_transfer )
App.use(api_path+'units', units )
App.use(api_path+'users', login )





// error handler

App.use((err,req,res,next) => {

    console.log('In error handelr')

    if(!err.statusCode)
        err.statusCode = 500

    if(!err.message)
        err.message = 'Internal Server Error'

    console.log(err)
    
    res.status(err.statusCode).json(err.message)

})


Db.query('SELECT * FROM users')
.then(r => console.log(JSON.stringify(r,'',2)))
.catch(e => console.log(JSON.stringify(e,'',2)))


App.listen(80, {host: '0.0.0.0'}, ()=>{
   console.log('Listening at 80')
})