// models/book.js
// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    ISBN: {
        type: String,
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        required: true
    },
    yearOfPublication: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    availableCopies: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('BooksDB', bookSchema);
