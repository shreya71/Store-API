require('dotenv').config()

//async errors

const express = require('express');
const app = express();

//connecting with DB
const connectDB = require('./db/connect')

const notFoundMidddleware = require('./middleware/not-found')
const errorMidddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes

app.get('/', (req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

//products routes




app.use(notFoundMidddleware)
app.use(errorMidddleware)

const port = process.env.PORT || 3000

const start = async () =>{
    try{
        //connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening port ${port}...`))
    } catch(error) {
        console.log(error)
    }
}

start()