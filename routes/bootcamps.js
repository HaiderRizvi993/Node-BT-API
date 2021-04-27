const express = require('express');
const { 
        getBootcamps, 
        getBootcamp, 
        createBootcamp, 
        updateBootcamp, 
        deleteBootcamp,
        getBootcampsInRadius,
        bootcampPhotoUpload
} = require('../controllers/bootcamps')

const { protect, authorize } = require('../middleware/auth');

const router =  express.Router();
const Bootcamp = require('../models/Bootcamp');
//Advance results;
const advancedResults = require('../middleware/advancedResults');

//Include other resource routers
const courserRouter = require('./courses');

    //Re-route into other resource routers;
router.use('/:bootcampId/courses', courserRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
        .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
        .post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/:id')
        .get(getBootcamp)
        .put(protect, authorize('publisher', 'admin'), updateBootcamp)
        .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router.route('/:id/photo')
        .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);


module.exports = router;


