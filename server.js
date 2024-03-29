console.clear();
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileUpload');
var cookieParser = require('cookie-parser');

//custom errors!!
const errorHandler = require('./middleware/error');

//Load Env to use .env file variables.
dotenv.config({path: './config/config.env'});
const connectDB = require('./config/db');

//Connect to DB;
connectDB();

//Routers import
//const logger = require('./middleware/logger');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');


const app = express();
// TO use req.body we use this middleware
app.use(express.json());
//cookies parser!!
app.use(cookieParser())


//app.use(logger);
//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//fileUpload express fileUpload
app.use(fileUpload());

//Set static Folder //Public as static
app.use(express.static(path.join(__dirname, 'public')));


//Routes 
app.get('/', (req, res) =>{
    res
        .status(200)
        .send('<h1>Welcome to DevBootCamps!!</h1>');       
});
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

//.send('Welcome to DevBootCamps!!'); // It Also set header Ac
//.send({ data: 'Welcome to DevBootCamps!!'});
//We can sent JSON by simple passing JS object.


app.use(errorHandler);
//PORT and lesion server 
const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} mode!!`.yellow.bold);
});

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server and exit process
    server.close(() => process.exit(1));
})


/* const logger = (req, res, next) => {
    req.hello = 'Hello World';
    console.log('Middleware run');
    next();
}
 */

//This will be avaiable in all the middlewares run after it.