const express = require('express')
const cookieParser = require("cookie-parser")
const errorMiddleware = require('./middleware/error')
const bodyParser = require('body-parser')


const app = express()

app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())

//Route imports
const product = require('./routes/productRoute')
const order = require('./routes/ordersRoute')
const user = require('./routes/userRoute')

app.use('/api/v1', product)
app.use('/api/v1', user)
app.use('/api/v1',order)

//middleware for errors
app.use(errorMiddleware)

module.exports = app