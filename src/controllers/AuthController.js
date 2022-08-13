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


exports.login = async (req, res) => {
    const {
        username,
        password,
        token,
        device,
    } = req.body

    try {
        // find user
        const user = await User.findOne({
            $or: [
                { username },
                { email: username },
                { phone: username },
            ],
        }).select('+password')
            .select('+profile')
            .select('+token')

        if (!user) {
            return res.status(401).json({ message: 'User not found!' })
        }


        // eslint-disable-next-line prefer-arrow-callback
        await user.comparePassword(password, async function (err, isMatch) {
            if (err) throw err

            if (isMatch) {
                // Passwords match
                const userObj = { ...user._doc }
                delete userObj.password
                delete userObj.token
                // generate token
                const token = basicToken(username, password)
                // update data
                await Object.assign(user, {
                    token,
                }).save()

                return res.status(200).json({
                    message: 'success',
                    user: {
                        ...userObj,
                    },
                    token,
                })
            }
            else {
                // Passwords don't match
                return res.status(401).json({ message: 'Invalid Login!' })
            }
        })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.logout = async (req, res) => {
    const user = req.headers.tokenDecoded
    try {
        // find user
        const myUser = await User.findById(user._id)

        if (!myUser) {
            return res.status(401).json({ message: 'User not found' })
        }

        // update token fcm
        await Object.assign(myUser, {
            token: null,
        }).save()

        return res.status(200).json({ message: 'success' })
    }
    catch (err) {
        return res.status(401).json({ message: err.message })
    }
}

exports.register = async (req, res) => {
    const user = req.headers.tokenDecoded
    const {
        username,
        email,
        password,
        name,
		role,
		device,
    } = req.body

    try {

        const isExistEmail = await User.findOne({ email })
        if (isExistEmail) {
            return res.status(401).json({ message: 'Email already used' })
        }

        const isExistUsername = await User.findOne({ username })
        if (isExistUsername) {
            return res.status(401).json({ message: 'Username already used' })
        }
        if(!password || !name || !role ){
            return res.status(422).json({ message: 'Data cannot be processed!' })
        }
     
        const payloadUser = {
            username,
        	email,
        	password,
        	name,
			role,
			device,
            token: null
        }
        
        const user = new User(payloadUser)


        user.save()

        return res.status(200).json({ message: 'success' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}