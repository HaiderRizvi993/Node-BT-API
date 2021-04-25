const path = require('path'); //Node Js module for  dealing with paths
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/ErrorResponce');
const asyncHandler =  require('../middleware/async');



// @desc To get all Boottcamps
// @route GET api//v1/bootcamps
// @access Pubic
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
            return next(new ErrorResponce(`Boot camp not found with id ${req.params.id}`, 404));
        } 
    bootcamp.remove();
    res.status(200).json({success: true, msg: `Deleted BootCamp ${req.params.id}`, data: {}});
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc    To Upload Photo
// @route   PUT api//v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
            return next(new ErrorResponce(`Boot camp not found with id ${req.params.id}`, 404));
    } 

    //IF no photo attached.
    if(!req.files){
        console.log(req.files);
        return next(new ErrorResponce(`No file attached...!!`, 400));
    }

    const file = req.files.file;
    
    //Validation img is a photo??
    if(!file.mimetype.startsWith('image')){
        console.log("Yes image");
        return next(new ErrorResponce(`Upload a image.!!`, 400));
    }

    //Img size check
    if(file.size > process.env.MAXIMUM_FILE_SIZE){
        return next(new ErrorResponce(`Upload a image with size less than ${process.env.MAXIMUM_FILE_SIZE}`, 400));
    }

    // Create custom filename;
    //Get the extantion using path.parse
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
        if(err) {
            console.log(err);
            return next(new ErrorResponce(`Problem with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(
            req.params.id,
            { photo: file.name});
        
        res.status(200)
            .json({
                success: true, 
                data: file.name
        });
    });
});




