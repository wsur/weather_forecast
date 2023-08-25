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
        var lat = 0;
        var lon = 0;
        var i = 0;
        var j;
        var local_names = "";
        var succes = 0;
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

            /*Соверщенно не нужно вводить страну, нужно сделать отбор по локальным именам.
            * Проверяем все строки из списка. Если хотя бы в одной из них существует то же имя, что мы ввели,
            * тогда выводим информацию из текущей строки.
            * Если такой строки не нашлось, тогда широта и долгота остаются в нулевом состоянии
            * и мы выводим надпись "К сожалению, мы не нашли город, который Вы искали."
            */
           console.log("Количество вариантов ответа: " + coordinates_json.length);
           for (j=0; j < coordinates_json.length; j++){
            //console.log("Количество записей в "+j+"-ой строчке: " + coordinates_json[j]["local_names"]);
            local_names = coordinates_json[j]["local_names"];
            for(var field in local_names){
                console.log("Печатаем значение поля локального имени: "+ local_names[field])
                if(local_names[field] == CITY){
                    console.log("нашли похожее имя: " + local_names[field]);
                    console.log("Номер записи: "+ j);
                    console.log("Всё успешно, записываем координаты")
                    lat = coordinates_json[i]["lat"];
                    console.log("широта: "+ lat);
                    lon = coordinates_json[i]["lon"];
                    console.log("долгота " + lon);
                    succes = 1;
                }

            }
           }
            if (succes){
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