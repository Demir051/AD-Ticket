const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    departure: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    passengerCount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
