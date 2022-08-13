/* eslint-disable no-console */
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '500mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ limit: '256mb', extended: true }))

app.use('/api', express.static(path.join(__dirname, 'public')))

// port config
const port = process.env.PORT || 3000

// DB Config
const config = require('./src/config/config')
const _setting = require('./src/config/setting')

const { db } = config

// Connect to Mongo
mongoose.set('debug', _setting.modeDebug)
mongoose
	.connect(db, {
		useNewUrlParser: true, // Adding new mongo url parser
		useUnifiedTopology: true,
	})
	.then(() => console.log(`MongoDB Connected to ${process.env.NODE_ENV}`))
	.catch((err) => console.log(err))


// Require routes
require('./src/routes')(app)

app.get('/', (req, res) => {
	res.send(`You are connected to The Lorry Online api on environtment: ${process.env.NODE_ENV}`)
})

// Express application will listen to port mentioned in our configuration
app.listen(port, (err) => {
	if (err) throw err
	console.log(`App listening on port ${port}`)
})

