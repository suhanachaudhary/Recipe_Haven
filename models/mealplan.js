const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    monday:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    tuesday:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    thursday:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    friday:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    saturday:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    sunday:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
