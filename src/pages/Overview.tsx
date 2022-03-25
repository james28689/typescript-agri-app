import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";
import { centroid } from "@turf/turf";
import axios from "axios";

import { ReactComponent as SunIcon } from "../images/sun.svg";
import { ReactComponent as SunCloudIcon } from "../images/sun-cloud.svg";
import { ReactComponent as CloudIcon } from "../images/cloud.svg";
import { ReactComponent as CloudsIcon } from "../images/clouds.svg";
import { ReactComponent as CloudRainIcon } from "../images/cloud-showers.svg";
import { ReactComponent as CloudSunRainIcon } from "../images/cloud-sun-rain.svg";
import { ReactComponent as ThunderstormIcon } from "../images/thunderstorm.svg";
import { ReactComponent as SnowIcon } from "../images/snowflake.svg";
import { ReactComponent as FogIcon } from "../images/fog.svg";

interface IFieldWeather {
    id: string;
    temp: number;
    wind: number;
    icon: string;
}

interface CodeIconPair {
    code: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
}

const weatherCodeIconPairs: CodeIconPair[] = [
    {
        code: "01",
        icon: SunIcon,
        text: "Clear"
    },
    {
        code: "02",
        icon: SunCloudIcon,
        text: "Cloudy with Sun"
    },
    {
        code: "03",
        icon: CloudIcon,
        text: "Cloudy"
    },
    {
        code: "04",
        icon: CloudsIcon,
        text: "Overcast"
    },
    {
        code: "09",
        icon: CloudRainIcon,
        text: "Raining"
    },
    {
        code: "10",
        icon: CloudSunRainIcon,
        text: "Raining with Sun"
    },
    {
        code: "11",
        icon: ThunderstormIcon,
        text: "Thunderstorm"
    },
    {
        code: "13",
        icon: SnowIcon,
        text: "Snowing"
    },
    {
        code: "50",
        icon: FogIcon,
        text: "Fog"
    }
]

export default function Overview() {
    const { fields } = useDatabase();
    const [fieldWeathers, setFieldWeathers] = useState<IFieldWeather[] | null>(null);

    useEffect(() => {
        const getWeather = async () => {
            if (fields) {
                const newFieldWeathers = await Promise.all(fields.map(async (field) => {
                    const center = centroid(field.geometry).geometry.coordinates;
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${center[1]}&lon=${center[0]}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
                    return {
                        id: field._id,
                        temp: parseFloat((response.data.main.temp - 273.15).toFixed(2)),
                        wind: response.data.wind.speed,
                        icon: response.data.weather[0].icon
                    } as IFieldWeather
                }));

                setFieldWeathers(newFieldWeathers)
            }
        }

        getWeather();
    }, [fields])

    return (
        <div className="flex">
            <Nav active="Fields" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <h1 className="text-3xl my-4 pb-4 font-semibold text-secondary-900">Fields</h1>

                    <div className="my-4 align-middle shadow-md overflow-hidden border-gray-700  rounded-lg">
                        <table className="table-auto divide-y divide-gray-200 min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {
                                        ["Name", "Weather", "Area", "Crop"].map(heading => {
                                            return(
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{heading}</th>
                                            )
                                        })
                                    }

                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                { fields && fieldWeathers && fields.map(field => {
                                    const text = weatherCodeIconPairs.find(p => p.code === (fieldWeathers!.filter(fW => fW.id === field._id)[0].icon).slice(0,2))!.text
                                    const Icon = weatherCodeIconPairs.find(p => p.code === (fieldWeathers!.filter(fW => fW.id === field._id)[0].icon).slice(0,2))!.icon;
                                    
                                    return(
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{field.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex flex-row space-x-2"><Icon className="w-6 h-6 text-primary-600 fill-current" /><p>{text}</p></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{field.geometry.properties!.area_ha.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{field.crop}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/field/${field._id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
