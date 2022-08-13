/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */
/* eslint-disable func-names */
const moment = require('moment-timezone')
const {
    Order,
	Tracking
} = require('../models')
const {randomCode} = require('../utils')
const counterOrderNumber = async (data) => {
	const { multiAgreement } = data || {}

	const a = moment().format('YYYY-MM-DD 00:00:00')
	const b = moment().format('YYYY-MM-DD 23:59:59')

	const amount = await Order.countDocuments({
		createdAt: {
			$gte: a,
			$lte: b,
		},
	})
	const date = moment().format('YYMMDD')
	const randomNumber = randomCode(2, 'number')
	let counter = (amount + 1).toString()

	const digitCounter = 5
	for (let i = 0; i <= digitCounter - counter.length; i += 1) {
		counter = `0${counter}`
	}

	let orderNumber = `ORD${date}${randomNumber}${counter}`

	const isExist = await Order.findOne({ orderNumber })

	if (isExist) {
		orderNumber = await counterOrderNumber()
	}
	return orderNumber
}

exports.create = async (req, res) => {
	const user = req.headers.tokenDecoded
	try {
		const onGoingDriver = await Order.findOne({driver: user._id,status : {$ne:'2'}})
		if(onGoingDriver)return res.status(400).json({ message: 'harap selesaikan order sebelumnya terlebih dulu' })
		const formData = req.body
        formData.status = -1
		formData.orderNumber= await counterOrderNumber()
		let order = new Order(formData)
		order = await order.save()
		return res.status(200).json({ message: 'success', data: order })
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}
exports.get = async (req, res) => {
    try {
        const order = await Order.find().populate('driver')
		return res.status(200).json({ message: 'success', data: order })
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}
exports.pickup = async (req, res) => {
    const user = req.headers.tokenDecoded
	const { id } = req.params
	const {long,lat}= req.body
	try {
        const order = await Order.findOne({order:id,driver:user._id}).populate('driver')
		if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' })
		if(order.status !== '-1')return res.status(404).json({ message: 'Harap cek status order' })
		await order.updateOne({ status: 0 })
		const newLocation = {
			long : long ? long : '0',
			lat : lat ? lat :'0',
			driver : user._id,
			driver : order._id,
		}
		new Tracking(newLocation).save()
		return res.status(200).json({ message: 'success melakukan pickup'})
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}
exports.onduty = async (req, res) => {
    const user = req.headers.tokenDecoded
	const { id } = req.params
	const { long,lat} = req.body
    console.log(user)
    try {
        const order = await Order.findOne({order:id,driver:user._id}).populate('driver')
		if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' })
		if(order.status !== '0')return res.status(404).json({ message: 'Order harap melakukan pickup terlebhin dahulu' })
		await order.updateOne({ status: 1 })
		const newLocation = {
			long : long ? long : '0',
			lat : lat ? lat :'0',
			driver : user._id,
			driver : order._id,
		}
		new Tracking(newLocation).save()
		return res.status(200).json({ message: 'success silahkan melakukan perjalanan ke customer'})
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}
exports.done = async (req, res) => {
    const user = req.headers.tokenDecoded
	const { id } = req.params
	const {long,lat}= req.body

    try {
        const order = await Order.findOne({order:id,driver:user._id}).populate('driver')
		if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' })
		if(order.status !== '1')return res.status(404).json({ message: 'Order harap melakukan perjalanan terlebhin dahulu' })
		await order.updateOne({ status: 2 })
		const newLocation = {
			long : long ? long : '0',
			lat : lat ? lat :'0',
			driver : user._id,
			driver : order._id,
		}
		new Tracking(newLocation).save()
		return res.status(200).json({ message: 'success order telah selesai'})
	}
	catch (err) {
		return res.status(400).json({ message: err.message })
	}
}