import {City} from './Modules/City.js'
import {Comment} from './Modules/Comment.js'


const _getFromLocalStorage = function(){
    return JSON.parse(localStorage.getItem("cities") || "[]")
}
let cities = _getFromLocalStorage()
let cityId = 0
let commentId = 0


const _saveToLocalStorage = function(){
    localStorage.setItem("cities",JSON.stringify(cities))
}

const _checkCityIndexNumber = function(cityId){
    for(let i=0;i<cities.length;i++){
        if(cities[i].id===cityId){
            return i
        }
    }
}

const addCity = function(myData){
    let id = cityId
    let name = myData.location.name
    let tempC = myData.current.temp_c
    let tempF = myData.current.temp_f
    cities.push(new City(id,name,tempC,tempF))
    cityId++
}

const addComment = function(text, cityId){
    let i = _checkCityIndexNumber(cityId)
    cities[i].comments.push(new Comment(commentId,text))
    commentId++
}

const deleteCity = function(cityId){
    let i = _checkCityIndexNumber(cityId)
    cities.splice(i,1)
}

const renderScreen = function(){
    $(".cities-here").empty()
    const source = $("#city-weather-template").html()
    const template = Handlebars.compile(source)
    let newHTML = template({city:cities})
    $(".cities-here").append(newHTML)
    _saveToLocalStorage()
}

const searchForCityTemp = function(){
    let city = $("#cityName").val()
    $.get("http://api.apixu.com/v1/current.json?key=53c879f5453c4fe488d71625180609&q=" + city).then((data)=>{
        addCity(data)
        renderScreen()
        $("#cityName").val("")
    }).catch((data)=>{
        alert("Error:" + data)
    })
}

const sendComment = function(text, cityId){
    addComment(text,cityId)
    renderScreen()
    $("#commentInput").val("")
}



$("#getCityTemp").on("click", function(){
    searchForCityTemp()
})

$("#cityName").keyup(function(event){
    if(event.keyCode===13){searchForCityTemp()}
})

$(".cities-here").on("click", ".sendComment", function(){
    let text = $(this).closest(".flex").find(".commentInput").val()
    let cityId = $(this).closest(".city").data().id
   sendComment(text, cityId)
})

$(".cities-here").on("click", ".deleteCity", function(){
    cityId = $(this).closest(".city").data().id
    deleteCity()
    renderScreen()
})

renderScreen();
