/* eslint-disable no-else-return */
const { User } = require('../models')

const EnsureToken = async (req, res, next) => {
    const token = req.headers.Authorization || req.headers.authorization
    if (!token ) {
        return res.status(401).json({ message: 'Unauthorized User!' })
    }
    const splitToken = token.split("Bearer ")[1]
    if (!splitToken) {
        return res.status(401).json({ message: 'Unauthorized User!' })
    }
    const checkUser = async (usrname) => {
        const user = await User.findOne({
            username: usrname,
            deleted: { $in: [true, false] },
        })
            .lean()
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized User!' })
        }
        return JSON.parse(JSON.stringify(user))
    }

    // decode token
    if (token) {
        let decodeToken = (Buffer.from(token.split(" ")[1], 'base64').toString())
        decodeToken = decodeToken.split(":")[0]

        let _user = await checkUser(decodeToken)
        req.headers.tokenDecoded = _user
        return next()
    }

    else {
        // if there is no token
        // return an error
        return res.status(401).send({ message: 'Unauthorized User!' })
    }
}

module.exports = EnsureToken