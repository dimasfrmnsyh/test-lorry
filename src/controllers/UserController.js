/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */
/* eslint-disable func-names */

const mongoose = require('mongoose')
const basicToken = require('basic-auth-token');

const {
    User,
} = require('../models')

exports.getAllUsers = async (req, res) => {
    try {
		const data = await User.find()
		return res.status(200).json({ status: 'success',message:data })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
