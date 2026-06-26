const mongoose = require('mongoose');

const groceryListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        default: 'My Grocery List',
    },
    items: [{
        ingredient: { type: String, required: true },
        checked: { type: Boolean, default: false },
    }],
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
    }],
}, { timestamps: true });

module.exports = mongoose.model('GroceryList', groceryListSchema);
