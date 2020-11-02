
const Express = require('express')
const App =  new Express()

const path = require('path')

const cHelmet =  require('./utilities/secure')
// optimization s

const compression = require('compression')


//const compression = require('compression')


App.use(compression({ level : 9 }))

const history = require('connect-history-api-fallback')



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
        console.log(`email -> ${email} pass -> ${pass}`)
    	console.log(JSON.stringify(r),'',2)
        
        bcrypt.compare(pass,r.password)
        .then( (rr) => {
		console.log('rr '+rr)
        
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
    limit: "100kb"
}))


App.use(Express.urlencoded({
    extended: true
}))



App.use(history({
    verbose: false,
    rewrites: [{
        from: /\api\/v1\//,
        to: function(context) {
            return context.parsedUrl.path
        }
    }]
}))


App.use(Express.static('./dist'))

App.use(session({
   // store: session.MemoryStore,
    name: 'browserAgent',
    secret: ';2.xhjsu@f2u!3e)(23u29',
    resave: true,
    saveUninitialized: false
}))

App.use(passport.initialize())
App.use(passport.session())


App.use(cHelmet)




// middlewares

App.use(function (req, res, next) {

   
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'/*,'http://192.168.1.6:8080','*'*/,'https://bitdefender.com','http://bitdefender.com');
  //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,application/json');
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
    //console.log(`path -> ${req.path} to ${toPath} and`)
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

    console.log(toPath)
    
    //console.log('User is ->  ' + JSON.stringify(req.user,'',2))

    if(toPath && toPath[1])
    {   
        console.log('in')
        if((toPath[1] == 'login_f' || toPath[1] == 'logout' ) /* && !req.user */  )
        {   

		if(!req.user || (req.user && toPath[1] == 'logout')  )
		{
	
			console.log(`Is Login. bypassing user ${JSON.stringify(req.user)}`)
			console.log(JSON.stringify(req.user))
           	 next()
            	return;
		}
		else
		{
			res.status(200).json('already logged in'); return;
		}
        }
            
        else if(req.user)
        {
            console.log(req.user.roles)
            let keys = Object.keys(req.user.roles)

            console.log(toPath[1] + '  '+ req.user.roles[toPath[1]] + '  ' + req.method )
            if( (exception.includes(toPath[1]))  || (keys.includes(toPath[1]) && req.user.roles[toPath[1]].includes(req.method.toLowerCase()))  )
            {
                console.log(`Exception Hit -> ${toPath[1]}`)
                next()
                return;
                
            }
            else
                res.status(401).json('Access Denied')
        }
	else
	{
		console.log(`Not logged in`);
		res.status(401).json('Not logged in')
		//next()	
}
        
    }
	else
{
	console.log(`Nothing Worked.`)
    next()
}
    
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

    console.log('isLoggedIn user is '+ req.user)
    if(req.user)
    {
        res.status(200).json({status: true, name: req.user.name, email: req.user.email })
    }
    else    
        res.status(401).json({status: false})
} )


App.get('/api/v1/logout', (req,res) => {
   // if(req.user)
    //{
        req.logout()
//	req.session.destroy();
//        res.status(200).json({status: true})
	req.session.destroy(function (err) {
   	 if (err) { return next(err); }
    		// The response should indicate that the user is no longer authenticated.
    		return res.json({ authenticated: req.isAuthenticated() });
  	});   

 //}
        
  //  else
    //    res.status(500).json({status: false})
} )

let exception = [
    'units',
    'isLoggedIn',
	'logout'

]



// routes


App.get('/',Handler.Bless(async (req,res,next) => {
    //console.log('yp')
    res.sendFile('index.html', {root: __dirname})
}))





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

/*
Db.query('SELECT * FROM users')
.then(r => console.log(JSON.stringify(r,'',2)))
.catch(e => console.log(JSON.stringify(e,'',2)))
*/

App.listen(80,/* {host: '0.0.0.0'},*/ ()=>{
   console.log('Listening at 80')
})
