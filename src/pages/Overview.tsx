import React from "react";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";

export default function Overview() {
    const { fields } = useDatabase();

    return (
        <div className="flex">
            <Nav />

            <div className="w-screen h-screen ml-60">
                <h1>Fields</h1>

                <div className="my-4 mx-8 align-middle shadow-md overflow-hidden border-gray-700  rounded-lg">
                    <table className="table-auto divide-y divide-gray-200 min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {
                                    ["Name", "RPA Field ID", "Area"].map(heading => {
                                        return(
                                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{heading}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            { fields && fields.map(field => {
                                return(
                                    <tr>
                                        {
                                            [field.name, field.rpa_field_id, field.geometry.properties!.area_ha.toFixed(2)].map(property => {
                                                return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property}</td>
                                            })
                                        }
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
