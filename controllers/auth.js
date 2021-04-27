const User = require('../models/User');
const ErrorResponce = require('../utils/ErrorResponce');
const asyncHandler =  require('../middleware/async');

// @desc    Register User
// @route   POST api/v1/auth/register
// @access  Pubic
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //Create User
    const user = await User.create({
        name,
        email, 
        password, 
        role
    });
    //Create token
    sendTokenResponse(user, 200, res);
});

// @desc    Login User
// @route   POST api/v1/auth/login
// @access  Pubic
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Validation of email and Password
    if(!email || !password){
        return next( new ErrorResponce('Please enter an email and password.!', 400));
    }

    //Check for user 
    const user = await User.findOne({ email: email }).select('+password');

    if(!user){
        return next( new ErrorResponce('Invalid Credentials.!', 401));
    }

    //Check if password matches 
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next( new ErrorResponce('Invalid Password.!', 401));
    }

    sendTokenResponse(user, 200, res);
});


//Get Token form model, create Cookie and sent response!!
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true, 
            token 
        });
};

// @desc    Get Current Login
// @route   POST api/v1/auth/me
// @access  private

exports.getMe = asyncHandler(async (req, res, next) => {
    console.log(123456);
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        success: true,
        data: user
    });
});

