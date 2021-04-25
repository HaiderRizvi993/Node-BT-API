const express = require('express');
const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
    } = require('../controllers/bootcamps')

const router =  express.Router();

//Include other resource routers
    const courserRouter = require('./courses');

    //Re-route into other resource routers;
    router.use('/:bootcampId/courses', courserRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/')
        .get(getBootcamps)
        .post(createBootcamp);
router.route('/:id')
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(deleteBootcamp);

module.exports = router;



/* router.get('/', (req, res) => {
    res
        .status(200)
        .json({success: true, msg: 'Show all bootcamps.'});
});

router.get('/:id', (req, res) => {
    res
        .status(200)
        .json({success: true, msg: `Display BootCamp ${req.params.id}`});
});

router.post('/', (req, res) => {
    res
        .status(200)
        .json({success: true, msg: 'Create new bootcamps.'});
});

router.put('/:id', (req, res) => {
    res
        .status(200)
        .json({success: true, msg: `Update BootCamp ${req.params.id}`});
});

router.delete('/:id', (req, res) => {
    res
        .status(200)
        .json({success: true, msg: `Delete BootCamp ${req.params.id}`});
}); */

