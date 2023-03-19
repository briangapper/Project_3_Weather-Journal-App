/* Global Variables */
console.log('0.) START');

let weatherDataArray = [];
let weatherDataObject = {};

let d = new Date();
let date = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

let temp = 0;
let zip = 0;
let feeling = '';

let port = 8000;
let pathGetData = `http://localhost:${port}/getWeatherData`;
let pathPostData = `http://localhost:${port}/postWeatherData`;

// Personal API Key for OpenWeatherMap API
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?q='
let apiKey = '&appid=42a3827b1945b5f64876ecf6a45dda62'

// Event listener to add function to existing HTML DOM element
document.getElementById('generate_btn').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e){
    
    console.log('1.) START function performAction');

    e.preventDefault();

    zip = document.getElementById('zip_input').value;
    feeling = document.getElementById('feeling_input').value;

    getWeatherData_API(baseURL, zip, apiKey, feeling);
    postWeatherData_server(pathPostData, weatherDataObject);
}

/* Function to GET Web API Data*/
async function getWeatherData_API(baseURL, zip, apiKey, feeling){

    console.log('2.) START function getWeatherData_API');
    const res = await fetch (baseURL + zip + apiKey);

    try{

        console.log('2.1) START TRY function getWeatherData_API');
        const response = await res.json();

        // getting temperature and converting to rounded celsius
        temp = (response['main'].temp - 273.15).toFixed(2);

        weatherDataObject = {
            temperature: temp,
            date: date,
            feeling: feeling
        }

        weatherDataArray.push(weatherDataObject);

        console.log('2.2) function getWeatherData_API --> weatherDataObject: ', weatherDataObject);
        console.log('2.3) function getWeatherData_API --> weatherDataArray: ', weatherDataArray);

        return weatherDataObject;

    } catch (error) {
        
        console.log('error: ', error)

    }
};

/* Function to POST data */
async function postWeatherData_server(url = '', data = {}){

    console.log('3.) START function postWeatherData_server');

    if(Object.keys(data).length === 0){
        console.log('3.0) ERROR function postWeatherData_server --> data{} empty!')
    }

    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    console.log('3.1) function postWeatherData_server --> res from fetch: ', res);

    try{

        console.log('3.2) START TRY function postWeatherData_server');

        const weatherData = await res.json();
        
        console.log('response: ', res)
        console.log('weatherData: ', weatherData)

        return weatherData;

    } catch(error) {

        console.log('error: ', error);

    }
};

/* Function to GET Project Data */
async function getWeatherData_server(url = ''){

    const res = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try{


    } catch(error) {

        console.log('error', error);

    }
}

