const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const CourseSchema = new Schema({
    title:{
        type: String,
        trim: true,
        required: [true, 'Please add a course']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition cost.']
    },
    minimumSkill: {
        type: String,
        required: [true, 'please add minimum skills required.'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarhipAvailable: {
        type: Boolean,
        default: false
    },
    cratedAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = model('Course', CourseSchema);
