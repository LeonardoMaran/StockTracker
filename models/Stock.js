const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StockSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: Array
    }
});

module.exports = Stock = mongoose.model('stock', StockSchema);
