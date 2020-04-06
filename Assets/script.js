//Need to assign "active" class to on click of recent searches

$().ready(function () {
    console.log("ready!");

    //LETS START WITH THE DATE AND FIVE DAY VARIABLES
    var today = (moment().format(' [(]M[/]D[/]YYYY[)]'))
    //must be a smarter way to iterate this...
    var nextFive = [{
        day: (moment().add(1, 'days').format('M[/]D[/]YYYY')),
    }, {
        day: (moment().add(2, 'days').format('M[/]D[/]YYYY')),
    }, {
        day: (moment().add(3, 'days').format('M[/]D[/]YYYY')),
    }, {
        day: (moment().add(4, 'days').format('M[/]D[/]YYYY')),
    }, {
        day: (moment().add(5, 'days').format('M[/]D[/]YYYY')),
    }]
    //TESTS FOR DATE VARIABLES
    // var tomorrow = 0;

    // console.log(theNextDay)

    //GLOBAL VARIABLES
    var navList = $('#recentCities')
    var fiveDay = $('#fiveDay')
    var userLocation = "";
    //API VARIABLES
    var wxKey = "&appid=d4e0d5067632cdd06a4bad12b5b1e650";
    var wxApi = "https://api.openweathermap.org/data/2.5/"
    var wxOne = "https://api.openweathermap.org/data/2.5/onecall?";
    var wxUvI = "uvi?"
    var wxCurr = "weather?"
    var imperials = "&units=imperial"
    // DYNAMIC OBJECT OF CURRENTLY SELECTED WEATHER LOCATION VARIABLES
    var recentSearches = []
    var activeLocation = {
        name: "", // response.name
        country: "", // response.sys.country
        temp: "", // response.main.temp
        humidity: "", // response.main.humidity
        wind: "", // response.wind.speed
        wxCond: "",// response.weather[0].description
        wxIcon: "", // response.weather[0].icon Gets the weather image icon class
        uvindex: "", // NEED TO FIND EXAMPLE API CALL
    }

    //--------- BEGIN API CALLS ---------
    //NEED TO MAKE A FUNCTION TO MAKE 3 API CALLS AND CREATE RESPONSE VARIABLES
    function callWxData(param) {
        callCurrApi(param)
        function callCurrApi(param) {
            queryURL = wxApi + wxCurr + param + imperials + wxKey
            console.log(queryURL)
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {
                    // NEED TO PASS LON,LAT STRING VALUE TO UV CALL
                    let lat = response.coord.lat;
                    let lon = response.coord.lon;
                    let coords = "lat=" + lat + "&lon=" + lon
                    console.log("Coordinate Check" + coords)
                    callUvApi(coords)
                    activeLocation.name = response.name
                    activeLocation.country = response.sys.country
                    activeLocation.temp = response.main.temp
                    activeLocation.humidity = response.main.humidity
                    activeLocation.wind = response.wind.speed
                    activeLocation.wxCond = response.weather[0].description
                    activeLocation.wxIcon = response.weather[0].icon
                    fiveDay.empty()
                    renderCurrWx()
                    // callDailyApi(param) // OLD CALL
                    callOneApi(coords)
                }) // end of then function
        } // end of CURRENT WX ajax call


        function callOneApi(param) {
            queryURL = wxOne + param + imperials + wxKey
            console.log(queryURL)
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response)
                    var dailyArray = response.daily
                    console.log(dailyArray)
                    for (let i = 1; i < dailyArray.length - 2; i++) {

                        // // console daily objects
                        let dailyObj = dailyArray[i];
                        console.log(dailyObj.temp.max)

                        let dayCard = $('<div>').addClass('dayCard').appendTo(fiveDay)
                        //append date insert moment iterator
                        $('<div>').addClass('card-header').appendTo(dayCard).text(nextFive[i - 1].day)
                        let wxDeets = $('<div>').addClass('card-body').appendTo(dayCard)
                        //append icon
                        $('<img>').appendTo(wxDeets).attr('src', "http://openweathermap.org/img/wn/" + dailyObj.weather[0].icon + "@2x.png").prop('alt', activeLocation.wxCond)
                        //temp
                        $('<p>').addClass('card-text').appendTo(wxDeets).text("Temperature: " + dailyObj.temp.max.toFixed(0) + " \xB0F")
                        //append humidity
                        $('<p>').addClass('card-text').appendTo(wxDeets).text("Humidity: " + dailyObj.humidity + "%")


                        // TARGET FIVE DAY CONTAINER AND CREATE ELEMENTS FOR EACH DAY OF OBJECT ARRAY {
                        //create card
                        // let dayCard = $('<div>').addClass('day-card').text()
                        // dayCard.appendTo(fiveDay)
                        // let futureDate = $('<div>').addClass('card-header').text()
                        // futureDate.appendTo(dayCard)
                        // let wxDeets = $('<div>').addClass('card-body').text()
                        // wxDeets.appendTo(dayCard)
                        // let futureIcon = $('<h5>').addClass('card-title').text()
                        // futureIcon.appendTo(wxDeets)
                        // let futureTemp = $('<p>').addClass('card-text').text()
                        // futureTemp.appendTo(wxDeets)
                        // let futureHum = $('<p>').addClass('card-text').text()
                        // futureHum.appendTo(wxDeets)
                    }

                }) // end of then function
        } // end of ONE CALL WX ajax call



        function callUvApi(param) {
            queryURL = wxApi + wxUvI + param + wxKey
            console.log(queryURL)
            $.ajax({
                url: queryURL,
                method: "GET",
            })
                .then(function (response) {
                    activeLocation.uvindex = response.value
                    let uvIndex = activeLocation.uvindex
                    console.log(activeLocation)
                    $('#cityUv').text("UV Index: " + uvIndex.toFixed(1))
                    if (uvIndex < 3) {
                        $('#cityUv').addClass('uvIndex uvLow')
                    }
                    if (uvIndex >= 3 && uvIndex < 5) {
                        $('#cityUv').addClass('uvIndex uvMod')
                    }
                    if (uvIndex >= 5 && uvIndex < 7) {
                        $('#cityUv').addClass('uvIndex uvHigh')
                    }
                    if (uvIndex >= 7 && uvIndex < 10) {
                        $('#cityUv').addClass('uvIndex uvVhigh')
                    }
                    if (uvIndex >= 10) {
                        $('#cityUv').addClass('uvIndex uvXtreme')
                    }
                }) // end of then function
        } // end of UV INDEX ajax call

    }
    //--------- END OF API CALLS ---------

    //--------- BEGIN LOCAL STORAGE FUNCTIONS ---------
    getLocal()
    function getLocal() {
        //Parse the local storage data for my specific 'Events' key and assign it a variable of stored
        var storedRecents = JSON.parse(localStorage.getItem('Recent Cities'))
        //if stored is null (doesn't exist) function ends and doesn't update calEvents array with the correct data.
        console.log(storedRecents)
        if (storedRecents !== null) {
            recentSearches = storedRecents;
            generateNav()
        }
    }// end of Get Local

    // THIS save FUNCTION IS WORKING AND SAVES VALUES ADDED TO THE INPUT BOX TO THE LOCAL STORAGE
    function saveRecents() {
        // // saves entire Object to local storage
        localStorage.setItem('Recent Cities', JSON.stringify(recentSearches));
    }

    function generateNav() {
        //NEEDED TO REVERSE THIS LOOP TO CREATE THE ELEMENTS IN THE SAME ORDER AS SEARCHED
        for (let i = recentSearches.length - 1; i >= 0; i--) {
            addNavItem(recentSearches[i])
        }
    }
    //--------- END LOCAL STORAGE ---------



    // BEGIN GEOLOCATION COORDINATES OF USER
    function getLocation() {
        // Make sure browser supports this feature
        if (navigator.geolocation) {
            // Provide our showPosition() function to getCurrentPosition
            console.log(navigator.geolocation.getCurrentPosition(showPosition));
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    // This will get called after getCurrentPosition()
    function showPosition(position) {
        // Grab coordinates from the given object
        var lat = "lat=" + position.coords.latitude.toFixed(2);
        var lon = "lon=" + position.coords.longitude.toFixed(2);
        userLocation = lat + "&" + lon
        console.log(userLocation);
        // for now this simply shows me the string to make an ajax call
        let localWxRqst = wxApi + "weather?" + userLocation + wxKey
        console.log(localWxRqst);

        // Call next function to get wx data NEEDS TO BE TURNED OFF FOR NOW
        callWxData(userLocation);

    }
    getLocation();
    //--------- END OF GEOLOCATION COORDINATES OF USER ---------

    function renderCurrWx() {
        //TARGET #activeCityCard ELEMENTS AND UPDATE EACH ELEMENT WITH KEY VALUES
        $('#cityName').text(activeLocation.name + ", " + activeLocation.country + today)
        $('#wxCond').attr('src', "http://openweathermap.org/img/wn/" + activeLocation.wxIcon + "@2x.png").prop('alt', activeLocation.wxCond)
        $('#cityTemp').text("Temperature: " + activeLocation.temp.toFixed(0) + " \xB0F")
        $('#cityHum').text("Humidity: " + activeLocation.humidity + "%")
        $('#cityWs').text("Wind Speed: " + activeLocation.wind + " MPH")
    }


    // ----------- SEARCH FUNCTIONALITY / NAV ITEM ADDITION
    $('#city-searchBtn').on('click', updateRecents)
    function updateRecents(e) {
        e.preventDefault();
        // take input of previous element and console log
        var searchCriteria = $(this).prev().val()
        // COOL NOW I HAVE A STRING TO DEFINE GLOBALLY SOMEPLACE.. PUSH TO AN ARRAY?
        console.log(searchCriteria)
        //this clears the input box after submitting
        $(this).prev().val('')

        //Push Search Criteria to recents array as long as the array is maximum 5 entries, otherwise remove the earliest
        if (recentSearches.length < 10) {
            recentSearches.unshift(searchCriteria)
            addNavItem(searchCriteria)
            saveRecents()
        }
        else {
            //REMOVE OLDEST ARRAY ITEM
            recentSearches.pop()
            //DELETE THE LAST ELEMENT FROM NAVLIST
            navList.children().last().remove()
            //ADD THE NEW ARRAY ITEM TO FRONT OF ARRAY
            recentSearches.unshift(searchCriteria)
            //APPEND THE NEW ARRAY ITEM TO THE TOP OF THE NAV LIST
            addNavItem(searchCriteria)
            saveRecents()
        }
        //CALL API WITH searchCriteria
        let urlParam = "q=" + searchCriteria
        callWxData(urlParam)
    } // end of updateRecents cities function

    function addNavItem(param) {
        let newNavItem = $('<li>').addClass('nav-item').attr('data-name', 'q=' + param)
        newNavItem.on('click', callWxBtn)
        let cityName = $('<a>').addClass('nav-link').attr('href', '#').text(param).appendTo(newNavItem)
        //NEEDS ONCLICK EVENT TO CALL callWxData FUNCTION, WITH VALUE ATTR
        newNavItem.prependTo(navList)
    }
    // FUNCTION TIED TO NAV LINK CLICKS TO TAKE THEIR DATA NAME AND SEND TO API CALL
    function callWxBtn() {
        let btnValue = ($(this).data('name'))
        callWxData(btnValue)
    }

    // ----------- END OF SEARCH FUNCTIONALITY / NAV ITEM ADDITION

}) // end of ready function