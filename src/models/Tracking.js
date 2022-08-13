/* eslint-disable global-require */
/* eslint-disable consistent-return */

/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose
const saltRounds = 10

const ModelSchema = Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    long: {type:String},
    lat: {type:String},
    gpsOn: { type: Boolean, default: true },
}, {
	timestamps: true,
})

ModelSchema.pre([
	'find',
	'findOne',
	'countDocuments',
], function () {
	const { withDeleted } = this.options
	if (this._conditions.deleted) {
		// query by this._conditions
	}
	else if (!withDeleted) {
		this.where({ deleted: false })
	}
})


module.exports = mongoose.model('Tracking', ModelSchema)
