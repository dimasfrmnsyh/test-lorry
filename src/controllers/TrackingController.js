/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */
/* eslint-disable func-names */
const mongoose = require("mongoose");
const moment = require('moment-timezone')
const open = require('open');
const {
    User,
    Order,
    Tracking
} = require('../models')

exports.getOneTracking = async (req,res)=>{
    const {orderNumber}= req.params
    console.log(orderNumber)
    try{
        const data = await Tracking.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderObj',
                },
            },
            {
                $unwind: '$orderObj'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driverObj',
                }
            },
            {
                $unwind: '$driverObj'
            },
            {
                $match:{
                    'orderObj.orderNumber': orderNumber 
                }
            },
            {
                $project: {
                    orderNumber: '$orderObj.orderNumber',
                    driver: '$driverObj.username',
                    longitude: '$long',
                    latitude: '$lat',
                    createdAt: '$createdAt'
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
        ])
        console.log(data)
        return open(`https://www.openstreetmap.org/?mlat=${data[0].latitude}&mlon=${data[0].longitude}zoom=12#map=14`) 
    // return res.status(200).json({ })
    } 
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
exports.getAllTracking = async (req,res) => {
    const user = req.headers.tokenDecoded
    try {
        const data = await Tracking.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderObj',
                },
            },
            {
                $unwind: '$orderObj'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driverObj',
                }
            },
            {
                $unwind: '$driverObj'
            },
            {
                $match:{
                    gpsOn: true,
                    'orderObj.status': {$ne: 2},
                }
            },
            {
                $project: {
                    orderNumber: '$orderObj.orderNumber',
                    driver: '$driverObj.username',
                    longitude: '$long',
                    latitude: '$lat',
                    createdAt: '$createdAt'
                },
            },
        ])
        return res.status(200).json({ message: 'success', data: data })
    } 
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.create = async (req, res) => {
    const user = req.headers.tokenDecoded
    //order id
	const { id } = req.params
	try {
		const formData = req.body
        const isExistOrder = await Order.findOne({_id: id})
        if(!isExistOrder)return res.status(404).json({ message: 'Order tidak ditemukan' })
        formData.driver = user._id
        formData.order = isExistOrder._id
		let tracking = new Tracking(formData)
		tracking = await tracking.save()
		return res.status(200).json({ message: 'success updating your location' })
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}