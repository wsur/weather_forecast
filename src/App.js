import React from "react";
import Info from "./components/info";
import Weather from "./components/weather";
import Form from "./components/form";

const API_KEY = "e228dc694c194eca0b0879ae1ad4b0f5";
//


class App extends React.Component {

    state = {
        temp: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        sunset: undefined,
        error: undefined
    }

    gettindWeather = async (e) => {
        e.preventDefault();
        var CITY = e.target.elements.city.value;
        var country = e.target.elements.country.value;
        console.log("страна из формы ввода: " + country);
        var lat = 0;
        var lon = 0;
        var name;
        var i = 0;
        if(CITY)
        {
            //Нужно сначала получить координаты, а потом погоду
            const API_Coordinates = await
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${CITY}&limit=5&appid=${API_KEY}`);
            console.log(API_Coordinates);
            console.log("Тип данных того что выше: " + typeof API_Coordinates);
            var coordinates_json = await API_Coordinates.json();//Объект json, множество строк
            console.log(coordinates_json);
            console.log("Преобразовали в javascipt-object, тип данных: "+ typeof coordinates_json);

                if(name != CITY){
                    console.log(i +"-й кандидат: " + coordinates_json[i])
                    name = coordinates_json[i]["name"];
                    console.log(name);
                    console.log(CITY);
                }
                //Делай отбор по локальным именам!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if(name == CITY) {
                    console.log("Всё успешно, записываем координаты")
                    lat = coordinates_json[i]["lat"];
                    console.log("широта: "+ lat);
                    lon = coordinates_json[i]["lon"];
                    console.log("долгота " + lon);
                }
            if (lat&lon != 0){
                const API_URL = await
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                const data = await API_URL.json();
                console.log(data);

                //Преобразование даты 
                var sunset = data.sys.sunset;
                var date = new Date();
                date.setTime(sunset);
                var sunset_date = date.getHours() +":"+ date.getMinutes() + ":" +date.getSeconds();

                //Преобразование в температуре
                var real_temp = data.main.temp;
                real_temp = Math.round(real_temp - 273.15);

                this.setState({
                    temp: real_temp,
                    city:data.name,
                    country: data.sys.country,
                    humidity: data.main.humidity,
                    sunset: sunset_date,
                    error: undefined
                });
            }
            else {
                this.setState({
                    temp: undefined,
                    city: undefined,
                    country: undefined,
                    humidity: undefined,
                    sunset: undefined,
                    error: "К сожалению, мы не нашли подходящего города"
                });
            }
        }
        else{
            this.setState({
                temp: undefined,
                city: undefined,
                country: undefined,
                humidity: undefined,
                sunset: undefined,
                error: "Введите название города"
            });
        }
    }
    

    render() {
        return (
            <div className="wrapper">
                <div className="main">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-5 info">
                                <Info />
                            </div>
                            <div className="col-sm-7 form">
                                <Form weatherMethod={this.gettindWeather} />
                                <Weather
                                temp = {this.state.temp}
                                city = {this.state.city}
                                country = {this.state.country}
                                humidity = {this.state.humidity}
                                sunset = {this.state.sunset}
                                error = {this.state.error}
                                />
                            </div>
                        </div>
                    </div> 
                </div>         
            </div>
        );
    }
}

export default App;