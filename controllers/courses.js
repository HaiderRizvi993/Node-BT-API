const Course = require('../models/Course');
const ErrorResponce = require('../utils/ErrorResponce');
const asyncHandler =  require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc To get all Courses
// @route GET api//v1/courses
// @route GET api//v1/bootcamps/:bootcampId/courses
// @access Pubic
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if(req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    }else {
        //Populate the Courses with BootCamps;
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;
    
    res
    .status(200)
    .json({ success: true,
            count: courses.length,
            data: courses});
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(
        new ErrorResponce(`No course with the id of ${req.params.id}`),
        404
        );
    }
    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc      Add single course
// @route     POST /api/v1/bootcamp/:bootcampId/courses
// @access    Public
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
        new ErrorResponce(`No Bootcamp found for ${req.params.bootcampId}`),
        404
        );
    }

    const course = await Course.create(req.body);
    
    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc      Update single course
// @route     PUT /api/v1/bootcamp/:bootcampId/courses
// @access    Public
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(
        new ErrorResponce(`No Bootcamp found for ${req.params.id}`),
        404
        );
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
    return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
        );
    }

    // Make sure user is course owner
    if (!course) {
    return next(
        new ErrorResponse(
            `User ${req.user.id} is not authorized to delete course ${course._id}`,
            401
        )
    );
}

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

