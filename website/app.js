console.log('0) START');

// Define port and server paths
const port = 8000;
const pathGetData = `http://localhost:${port}/getWeatherData`;
const pathPostData = `http://localhost:${port}/postWeatherData`;

// Personal API Key for OpenWeatherMapAPI
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?q='
const apiKey = '&appid=42a3827b1945b5f64876ecf6a45dda62'

// Event listener to add function to existing HTML DOM element
document.getElementById('generate_btn').addEventListener('click', performAction);

/* 1) async function performAction (called by event listener) */
async function performAction(e){
    
    console.log('1) START function performAction');

    e.preventDefault();

    let zip = document.getElementById('zip_input').value;
    let feeling = document.getElementById('feeling_input').value;

    try{

        const data = await getWeatherDataAPI(baseURL, zip, apiKey, feeling);
        await postWeatherDataServer(pathPostData, data);
        const weatherDataServer = await getWeatherDataServer(pathGetData);
        await updateUI(weatherDataServer);
    
    } catch(error) {

        console.log('ERROR performAction: ', error);

    } finally {

        console.log('1.X) END function performAction');

    }
}

/* 2) async function getWeatherDataAPI: request temperature from API */
async function getWeatherDataAPI(baseURL, zip, apiKey, feeling){

    console.log('2) START function getWeatherDataAPI');

    try {

        let response = await fetch (baseURL + zip + apiKey);
        let weatherDataAPI = await response.json();

        // getting temperature and converting to rounded celsius
        let temp = (weatherDataAPI['main'].temp - 273.15).toFixed(2);

        // generate new Date
        let d = new Date();
        let date = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

        let weatherDataObject = {
            zip: zip,
            temperature: temp,
            date: date,
            feeling: feeling
        }

        console.log('2.1) weatherDataObject: ', weatherDataObject);

        return weatherDataObject;

    } catch(error) {
        
        console.log('ERROR getWeatherDataAPI: ', error)

    } finally {

        console.log('2.X) END function getWeatherDataAPI')

    }
};

/* 3) async function postWeatherDataServer: POST data object into local server */
async function postWeatherDataServer(url = '', data = {}){

    console.log('3) START function postWeatherDataServer');

    try {
    
        if(Object.keys(data).length === 0){
            console.log('ERROR postWeatherDataServer: data{} empty!');
        }

        await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => console.log(data.message));        

    } catch(error) {

        console.log('ERROR postWeatherDataServer: ', error);

    } finally {

        console.log('3.X) END function postWeatherDataServer');

    }
};

/* 4) async function getWeatherDataServer: GET data array from local server */
async function getWeatherDataServer(url = ''){

    console.log('4) START function getWeatherDataServer');

    try {

        let response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let weatherDataServer = await response.json();

        console.log('4.1) weatherDataServer: ', weatherDataServer);
        return weatherDataServer;

    } catch(error) {

        console.log('ERROR getWeatherDataServer: ', error);

    } finally {

        console.log('4.X) END function getWeatherDataServer')

    }
}

/* 5) async function updateUI: update UI with passed data array from server */
async function updateUI(weatherDataServer = []){

    console.log('5) START function updateUI');

    try {

        let weatherDataClient = checkArrayLength(weatherDataServer);

        removeAllEntries();
          
        weatherDataClient.forEach(entry => {
            createNewEntry(entry);
        });

    } catch(error) {

        console.log('ERROR updateUI: ', error);

    } finally {

        console.log('5.X) END function updateUI');

    }
}

/* 5.1) function checkArrayLength: check length of array, update the UI with only the last 6 new objects */
function checkArrayLength(weatherDataServer = []){

    console.log(`5.1) checkArrayLength: ${weatherDataServer.length}`);

    let weatherDataClient = [];
    let maxEntries = 6;

    if(weatherDataServer.length >= maxEntries){

        weatherDataClient = weatherDataServer.slice(-maxEntries);
        return weatherDataClient;

    } else {

        return weatherDataServer;

    }
}

/* 5.2) function removeAllEntries: remove all entries from HTML to create them again */
function removeAllEntries(){

    let entries = document.getElementById('entries');

    while (entries.firstChild) {
      entries.removeChild(entries.firstChild);
    };

    if (entries.firstChild === null){
        console.log('5.2) All entries removed');
    }
}

/* 5.3) function createNewEntry */
function createNewEntry(entry = {}){

    console.log('5.3) START function createNewEntry');

    // create div for new entry
    let entry_div = document.createElement('div');
    entry_div.setAttribute('class', 'entry_div');

    // Zip
    let zip_div = document.createElement('div');
    zip_div.setAttribute('id', 'zip_div');
    zip_div.innerHTML = 'Zip: ';

    let zip = document.createElement('span');
    zip.setAttribute('id', 'zip');
    zip.innerHTML = entry['zip'];

    zip_div.appendChild(zip);
    entry_div.appendChild(zip_div);

    // Date
    let date_div = document.createElement('div');
    date_div.setAttribute('id', 'date_div');
    date_div.innerHTML = 'Date: ';

    let date = document.createElement('span')
    date.setAttribute('id', 'date');
    date.innerHTML = entry['date'];

    date_div.appendChild(date);
    entry_div.appendChild(date_div);

    // Temp
    let temp_div = document.createElement('div');
    temp_div.setAttribute('id', 'temp_div');
    temp_div.innerHTML = 'Temperature: ';

    let temp = document.createElement('span');
    temp.setAttribute('id', 'temp');
    temp.innerHTML = entry['temperature'] + '&deg';

    temp_div.appendChild(temp);
    entry_div.appendChild(temp_div);

    // Feeling
    let feeling_div = document.createElement('div');
    feeling_div.setAttribute('id', 'feeling_div');
    feeling_div.innerHTML = 'Feeling: ';

    let feeling = document.createElement('span');
    feeling.setAttribute('id', 'feeling');
    feeling.innerHTML = entry['feeling'];

    feeling_div.appendChild(feeling);
    entry_div.appendChild(feeling_div);

    // Add new entry_div to HTML parent grid
    document.getElementById('entries').appendChild(entry_div);
}