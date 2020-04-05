//Need to assign "active" class to on click of recent searches

$().ready(function () {
    console.log("ready!");

    //GLOBAL VARIABLES
    var navList = $('#recentCities')
    var userLocation = "";
    var wxKey = "&appid=d4e0d5067632cdd06a4bad12b5b1e650";
    var wxApi = "api.openweathermap.org/data/2.5/"
    // DYNAMIC OBJECT OF CURRENTLY SELECTED WEATHER LOCATION VARIABLES
    var recentSearches = []
    var currentWx = {
        name: "", // response.name
        temp: "", // response.main.temp
        humidity: "", // response.main.humidity
        wind: "", // response.wind.speed
        wxCond: "",// response.weather.description
        wxIcon: "", // response.weather.icon Gets the weather image icon class
        uvindex: "", // NEED TO FIND EXAMPLE API CALL
        forecast: [{
            date: "", // response.
            temp: "", // response.
            humidity: "", // response.
            wxIcon: "", // response.
            wxCond: "",// response.
        }]
    }

    // FUNCTION DEFINES GEOLOCATION COORDINATES OF USER
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
        var lat = "lat=" + position.coords.latitude;
        var lon = "lon=" + position.coords.longitude;
        userLocation = lat + "&" + lon
        console.log(userLocation);
        // for now this simply shows me the string to make an ajax call
        let localWxRqst = wxApi + "weather?" + userLocation + wxKey
        console.log(localWxRqst);

        // Call next function to get wx data NEEDS TO BE TURNED OFF FOR NOW
        // callWxData(localWxRqst);
    }
    getLocation();
    // END OF GET GEOLOCATION FUNCTION

    function callWxData(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (reponse) {

            }) // end of then function


    } // end of callcurrentWx ajax call

    $('#city-searchBtn').on('click', updateRecents)


    function updateRecents(e) {
        e.preventDefault();
        // take input of previous element and console log
        var searchCriteria = $(this).prev().val()
        // COOL NOW I HAVE A LOCATION TO DEFINE GLOBALLY SOMEPLACE.. PUSH TO AN ARRAY?
        console.log(searchCriteria)
        //this clears the input box after submitting
        $(this).prev().val('')

        //Push Search Criteria to recents array as long as the array is maximum 6 entries, otherwise remove the earliest
        if (recentSearches.length <= 2) {
            recentSearches.unshift(searchCriteria)
            addNavItem(searchCriteria)
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

        }

        console.log(recentSearches)


    } // end of updateRecents cities function

    function addNavItem(searchCriteria) {
        let newNavItem = $('<li>').addClass('nav-item')
        let cityName = $('<a>').addClass('nav-link').attr('href', '#').text(searchCriteria).appendTo(newNavItem)
        //NEEDS ONCLICK EVENT TO CALL callWxData FUNCTION, WITH VALUE ATTR
        newNavItem.prependTo(navList)
    }

}) // end of ready function