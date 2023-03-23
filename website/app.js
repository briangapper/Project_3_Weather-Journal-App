/* Global Variables */
console.log('0) START');

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

// Personal API Key for OpenWeatherMapAPI
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?q='
let apiKey = '&appid=42a3827b1945b5f64876ecf6a45dda62'

// Event listener to add function to existing HTML DOM element
document.getElementById('generate_btn').addEventListener('click', performAction);

/* 1) function performAction (called by event listener) */
function performAction(e){
    
    console.log('1) START function performAction');

    e.preventDefault();

    zip = document.getElementById('zip_input').value;
    feeling = document.getElementById('feeling_input').value;

    getWeatherDataAPI(baseURL, zip, apiKey, feeling)
        .then(() => {
            postWeatherDataServer(pathPostData, weatherDataObject)
        })
        .then(() => {
            getWeatherDataServer(pathGetData)
        })
        .then(() => {
            updateUI()
        })
}

/* 2) async function getWeatherDataAPI */
async function getWeatherDataAPI(baseURL, zip, apiKey, feeling){

    console.log('2) START function getWeatherDataAPI');

    try {

        let res_fetch = await fetch (baseURL + zip + apiKey);
        let weatherDataAPI = await res_fetch.json();

        // getting temperature and converting to rounded celsius
        temp = (weatherDataAPI['main'].temp - 273.15).toFixed(2);

        weatherDataObject = {
            zip: zip,
            temperature: temp,
            date: date,
            feeling: feeling
        }

        console.log('2.1) weatherDataObject: ', weatherDataObject);

    } catch(error) {
        
        console.log('ERROR getWeatherDataAPI: ', error)

    } finally {

        console.log('2.X) END function getWeatherDataAPI')

    }
};

/* 3) async function postWeatherDataServer */
async function postWeatherDataServer(url = '', data = {}){

    console.log('3) START function postWeatherDataServer');

    try {
    
        if(Object.keys(data).length === 0){

            console.log('ERROR postWeatherDataServer: data{} empty!')
            
        }

        await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

    } catch(error) {

        console.log('ERROR postWeatherDataServer: ', error);

    } finally {

        console.log('3.X) END function postWeatherDataServer')

    }
};

/* 4) async function getWeatherDataServer */
async function getWeatherDataServer(url = ''){

    console.log('4) START function getWeatherDataServer');

    try {

        let res_fetch = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let weatherDataServer = await res_fetch.json();

        weatherDataArray = weatherDataServer;
        console.log('4.1) weatherDataArray: ', weatherDataArray)

    } catch(error) {

        console.log('ERROR getWeatherDataServer: ', error);

    } finally {

        console.log('4.X) END function getWeatherDataServer')

    }
}

/* 5) async function updateUI */
async function updateUI(){

    console.log('5) START function updateUI');

    try {

        document.getElementById('date').innerHTML = weatherDataObject['date'];
        document.getElementById('zip').innerHTML = weatherDataObject['zip'];
        document.getElementById('temp').innerHTML = weatherDataObject['temperature'];
        document.getElementById('feeling').innerHTML = weatherDataObject['feeling'];

    } catch(error) {

        console.log('ERROR updateUI: ', error);

    } finally {

        console.log('5.X) END function updateUI')

    }
}