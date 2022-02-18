const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    //userFrom 이 userTo를 구독하고 있는지
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }