import dotenv from 'dotenv'
import express from 'express'
// import bodyParser from 'body-parser'
import notesRouter from './src/routes/notes.js'
import session from 'express-session'
import RedisStore from 'connect-redis'
import usersRouter from './src/routes/users.js'
import auth from './src/middleware/auth.js'
// import redisClient from './src/redisClient.js'
import redisClient from './src/redisClient.js'


const app = express()
dotenv.config()

const PORT = process.env.PORT

// //Setting up Redis
// const redisClient = redis.createClient();
// redisClient.connect().catch(console.error)

const store = new RedisStore({ client: redisClient})

app.use(session({
    store: store,
    secret: process.env.REDIS_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie:{
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}))

//Middleware to parse JSON body 
app.use(express.json())

//notes routes with authentication middleware
app.use('/notes', auth, notesRouter)

//users routes
app.use('/users', usersRouter)

//Standard Route for Server
app.get('/', (request, response) => {
    response.json("Welcome to a Full Stack Experimental Application")
})


//sample comment for git commits
//Error handling for Middleware
app.use((error, request, response, next) => {
    console.error(error.stack)
    response.status(500).json({message: "An unexpected error occurred"})
})

//Setting up DEV Server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})



