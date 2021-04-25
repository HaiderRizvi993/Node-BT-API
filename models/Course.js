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

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    //console.log("Checking......");
    const obj = await this.aggregate([
    {
        $match: { bootcamp: bootcampId }
    },
    {
        $group: {
            _id: '$bootcamp',
            averageCost: { $avg: '$tuition' }
        }
    }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
    } catch (err) {
        console.error(err);
    }
};

  // Call getAverageCost after save
    CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
    });

  // Call getAverageCost before remove
    CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
    });

module.exports = model('Course', CourseSchema);
