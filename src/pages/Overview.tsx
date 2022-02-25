import React from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";

export default function Overview() {
    const { fields } = useDatabase();

    return (
        <div className="flex">
            <Nav active="Overview" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <h1 className="text-3xl my-4 pb-4 font-semibold text-secondary-900">Fields</h1>

                    <div className="my-4 align-middle shadow-md overflow-hidden border-gray-700  rounded-lg">
                        <table className="table-auto divide-y divide-gray-200 min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {
                                        ["Name", "RPA Field ID", "Area", "Crop"].map(heading => {
                                            return(
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{heading}</th>
                                            )
                                        })
                                    }

                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                { fields && fields.map(field => {
                                    return(
                                        <tr>
                                            {
                                                [field.name, field.rpa_field_id, field.geometry.properties!.area_ha.toFixed(2), field.crop].map(property => {
                                                    return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property}</td>
                                                })
                                            }
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
