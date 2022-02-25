import React, { useEffect, useState } from "react";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";
import { centroid } from "@turf/turf";
import axios from "axios";

interface IFieldWeather {
    id: string;
    temp: number;
    wind: number;
    icon: string;
}

export default function Weather() {
    const { fields } = useDatabase();
    const [fieldWeathers, setFieldWeathers] = useState<IFieldWeather[]>([]);
    const [loading, setLoading] = useState(false);

    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        if (fields !== null) {
            setLoading(true);
            let newFieldWeathers: IFieldWeather[] = [];
            fields.forEach(field => {
                const center = centroid(field.geometry).geometry.coordinates;
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${center[1]}&lon=${center[0]}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
                .then(res => {
                    // console.log(res);
                    const fieldWeather: IFieldWeather = {
                        id: field._id,
                        temp: parseFloat((res.data.main.temp - 273.15).toFixed(2)),
                        wind: res.data.wind.speed,
                        icon: res.data.weather[0].icon
                    }

                    newFieldWeathers.push(fieldWeather);
                });
            });
            console.log(newFieldWeathers);
            setFieldWeathers(newFieldWeathers);
            
            sleep(300).then(() => {
                forceUpdate();
                setLoading(false);
            });
        }
    }, [fields])

    return(
        <div className="flex">
            <Nav active="Weather" />

            <div className="w-screen h-screen ml-60">
                <h1>Weather</h1>
                { fieldWeathers?.map(fieldWeather => {
                    return(
                        <ul>
                            <li>{fieldWeather.id}</li>
                            <li>{fieldWeather.temp.toString()}</li>
                            <li>{fieldWeather.wind.toString()}</li>
                            <li>{fieldWeather.icon}</li>
                        </ul>
                    )
                })
                }

                { !loading && <button onClick={() => console.log(fieldWeathers)}>Print fieldWeathers</button>}
            </div>
        </div>
    )
}