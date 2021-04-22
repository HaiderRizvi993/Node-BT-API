const Bootcamp = require('../models/Bootcamp');


// @desc To get all Boottcamps
// @route GET api//v1/bootcamps
// @access Pubic
exports.getBootcamps = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: 'Show all bootcamps'});
}

// @desc To get single Boottcamp
// @route GET api//v1/bootcamps/:id
// @access Pubic
exports.getBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: `Display BootCamp ${req.params.id}`});
}

// @desc    To create Boottcamp
// @route   POST api//v1/bootcamps/:id
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    try{
        const bootcamp = await Bootcamp.create(req.body);
    res
        .status(201)
        .json({
            success: true,
            data: bootcamp});
    }
    catch(err) {
        res.status(400).json({success: false})
    }
    
}

// @desc    To Update single Boottcamp
// @route   PUT api//v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: `Update BootCamp ${req.params.id}`});
}

// @desc    To DELETE single Boottcamp
// @route   DELETE api//v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({success: true, msg: `Delete BootCamp ${req.params.id}`});
}

