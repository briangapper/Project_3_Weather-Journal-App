// Setup empty JS array to act as endpoint for all routes
const projectData = [];

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Request body-parser module
const bodyParser = require('body-parser');

// Configure Express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const port = 8000;
app.listen(port, listening);

// Callback to debug
function listening(){
    console.log(`Server running on localhost: ${port}`);
}

// Initialize all routes with a callback function
app.get('/getWeatherData', getWeatherData);

app.post('/postWeatherData', postWeatherData);

app.get('/:universalURL', throwError);

// Callback function to complete GET '/getWeatherData'
function getWeatherData(req, res){
    res.send(projectData);
}

// Callback function to complete POST '/postWeatherData'
function postWeatherData(req, res){
    
    let data = req.body;

    newEntry = {

        zip: data.zip,
        temperature: data.temperature,
        date: data.date,
        feeling: data.feeling 

    };

    projectData.push(newEntry);
    console.log('server projectData: ', projectData);

    let message = '3.1) server postWeatherData: Post successul';
    res.send({message});
}

// Callback function to complete GET '/:universalURL'
function throwError(req, res){
    res.send('404 URL NOT FOUND');
 };