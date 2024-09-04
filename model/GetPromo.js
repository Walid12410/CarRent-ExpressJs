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
},{timestamps : true,
    toJSON : { virtuals : true },
    toObject : { virtuals: true }
});

getPromoSchema.virtual("promoDetails",{
    ref: "Promo",
    localField : "promoId",
    foreignField : "_id"
});


const GetPromo = mongoose.model('GetPromo', getPromoSchema);


module.exports = {GetPromo};
