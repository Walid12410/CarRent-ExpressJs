const mongoose = require('mongoose');

const getPromoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    promoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Promo'
    },
    claimedAt: {
        type: Date,
        default: Date.now
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const GetPromo = mongoose.model('GetPromo', getPromoSchema);


module.exports = {GetPromo};
