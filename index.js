import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import notesRouter from './src/routes/notes.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT


//Middleware to parse JSON body 
app.use(bodyParser.json())

//All note routes 
app.use('/notes', notesRouter)

//Standard Route for Server
app.get('/', (request, response) => {
    response.json("Welcome to a Full Stack Experimental Application")
})


//Setting up DEV Server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
