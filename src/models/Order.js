/* eslint-disable global-require */
/* eslint-disable consistent-return */

/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose')
const { Schema } = mongoose

const ModelSchema = Schema({
	status: { type: String }, // -1 created,0 for pickup,1 for in duty,2 for done
	customer: { type: String },
	address: { type: String },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
	orderNumber: {type: String},

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
ModelSchema.post('save', function () {
})
module.exports = mongoose.model('Order', ModelSchema)
