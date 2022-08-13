const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthController')
const UserController = require('../Controllers/UserController')
const OrderController = require('../Controllers/OrderController')
const TrackingController = require('../Controllers/TrackingController') 


const {
    ensureToken,
} = require('../utils')
module.exports = function routes(app) {
    app.use('/api', router)
    router.post('/register', AuthController.register)
    router.post('/auth/login', AuthController.login)
    router.get('/auth/logout',ensureToken,AuthController.logout)
    router.get('/user', ensureToken,UserController.getAllUsers)
    router.post('/order',ensureToken,OrderController.create)
    router.get('/order',ensureToken,OrderController.get)
    router.patch('/order/:id/pickup',ensureToken,OrderController.pickup)
    router.patch('/order/:id/onduty',ensureToken,OrderController.onduty)
    router.patch('/order/:id/done',ensureToken,OrderController.done)
    router.put('/tracking/:id/create',ensureToken,TrackingController.create)
    router.get('/tracking',ensureToken,TrackingController.getAllTracking)
    router.get('/tracking/:orderNumber',TrackingController.getOneTracking)
    

}

