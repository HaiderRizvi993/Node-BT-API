const Bootcamp = require('../models/Bootcamp');


// @desc To get all Boottcamps
// @route GET api//v1/bootcamps
// @access Pubic
exports.getBootcamps = async (req, res, next) => {
    try{
        const bootcamps = await Bootcamp.find(); //Find all
        res
        .status(200)
        .json({success: true, count: bootcamps.length, data: bootcamps});
    }catch(err){
        res
        .status(400)
        .json({success: false});
    } 
}

// @desc To get single Boottcamp
// @route GET api/v1/bootcamp/:id
// @access Pubic
exports.getBootcamp = async (req, res, next) => {
    let id = req.params.id
    console.log(typeof(id));
    try{
        const bootcamp = await Bootcamp.findById(req.params.id); //Find By id    
        
        if(!bootcamp){
            return res.status(400).json({success: false})
        } 
        res.status(200).json({success: true, data: bootcamp});
    }catch(err){
        res.status(404).json({success: false, msg: 'No Match'});
    }
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
exports.updateBootcamp = async (req, res, next) => {
    try{
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, 
    {
        new: true,
        runValidators: true
    });

    if(!bootcamp) {
        return res.status(400).json({success: false});
    } 
    res.status(200).json({success: true, msg: `Update BootCamp ${req.params.id}`, data: bootcamp});
    }catch(err){
        res.status(400).json({success: false});
    }
};

// @desc    To DELETE single Boottcamp
// @route   DELETE api//v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try{
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp) {
        return res.status(400).json({success: false});
    } 
    res.status(200).json({success: true, msg: `Deleted BootCamp ${req.params.id}`, data: {}});
    }catch(err){
        res.status(400).json({success: false});
    }
}

