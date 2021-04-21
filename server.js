const express = require('express');
const dotenv = require('dotenv');

//Load Env to use .env file variables.
dotenv.config({path: './config/config.env'});

const app = express();

//Routes 
app.get('/', (req, res) =>{
    res.status(200)
        .send('<h1>Welcome to DevBootCamps!!</h1>');       
});

//.send('Welcome to DevBootCamps!!');
//.send({ data: 'Welcome to DevBootCamps!!'});
//We can sent JSON by simple passing JS object.

//PORT and lesion server 
const PORT = process.env.PORT || 5000;

app.listen(
    PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} mode!!`);
});