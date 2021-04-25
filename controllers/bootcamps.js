const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/ErrorResponce');
const asyncHandler =  require('../middleware/async');



// @desc To get all Boottcamps
// @route GET api//v1/bootcamps
// @access Pubic
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

  // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing Query.
    const bootcamps = await query; //Find all
    
    //Pagination Results
    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res
    .status(200)
    .json({success: true, count: bootcamps.length, pagination, data: bootcamps});
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




