// Setup empty JS object to act as endpoint for all routes
const projectData = [];

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
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

const server = app.listen(port, listening);

// Callback to debug
function listening(){
    console.log(`Server running on localhost: ${port}`);
}

// Initialize all route with a callback function
app.get('/getWeatherData', getWeatherData);

app.get('/:universalURL', throwError);

app.post('/postWeatherData', postWeatherData);

// Callback function to complete GET '/getWeatherData'
function getWeatherData(req, res){
    res.send(projectData);
}

// Callback function to complete GET '/:universalURL'
function throwError(req, res){
    res.send('404 URL NOT FOUND');
 };

// Callback function to complete POST '/postWeatherData'
function postWeatherData(req, res){
    
    let data = req.body;

    newEntry = {

        temperature: data.temperature,
        date: 'hello',
        // feeling: 

    }

    projectData.push(newEntry)
    console.log('server: ', projectData)
    console.log('data: ', data)
    
}

