console.clear();
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

//Routers import
//const logger = require('./middleware/logger');
const bootcamps = require('./routes/bootcamps');

//Load Env to use .env file variables.
dotenv.config({path: './config/config.env'});

const app = express();

//app.use(logger);
//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Routes 
app.get('/', (req, res) =>{
    res
        .status(200)
        .send('<h1>Welcome to DevBootCamps!!</h1>');       
});
app.use('/api/v1/bootcamps', bootcamps);

//.send('Welcome to DevBootCamps!!'); // It Also set header Ac
//.send({ data: 'Welcome to DevBootCamps!!'});
//We can sent JSON by simple passing JS object.

//PORT and lesion server 
const PORT = process.env.PORT || 5000;

app.listen(
    PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} mode!!`);
});


/* const logger = (req, res, next) => {
    req.hello = 'Hello World';
    console.log('Middleware run');
    next();
}
 */

//This will be avaiable in all the middlewares run after it.