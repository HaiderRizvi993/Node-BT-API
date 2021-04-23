const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/ErrorResponce');
const asyncHandler =  require('../middleware/async');


// @desc To get all Boottcamps
// @route GET api//v1/bootcamps
// @access Pubic
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find(); //Find all
    res
    .status(200)
    .json({success: true, count: bootcamps.length, data: bootcamps});
});

// @desc To get single Boottcamp
// @route GET api/v1/bootcamp/:id
// @access Pubic
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
    
  if (!bootcamp) {
      console.log("ShowBoot Camp                   ---------"+ bootcamp);
    return next(
      new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    To create Boottcamp
// @route   POST api//v1/bootcamps/:id
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res
    .status(201)
    .json({
         success: true,
        data: bootcamp}); 
});

// @desc    To Update single Boottcamp
// @route   PUT api//v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, 
    {
        new: true,
        runValidators: true
    });

    if(!bootcamp){
            return next(new ErrorResponce(`Boot camp not found with id ${req.params.id}`, 404));
        } 
    res.status(200).json({success: true, msg: `Update BootCamp ${req.params.id}`, data: bootcamp});
});

// @desc    To DELETE single Boottcamp
// @route   DELETE api//v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp){
            return next(new ErrorResponce(`Boot camp not found with id ${req.params.id}`, 404));
        } 
    res.status(200).json({success: true, msg: `Deleted BootCamp ${req.params.id}`, data: {}});
});

