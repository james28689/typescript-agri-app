import { useState, useEffect } from "react";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";
import { Link } from "react-router-dom";
import moment from "moment";

export default function Sales() {
    const { fields, sales } = useDatabase();
    const [usedCropTypes, setUsedCropTypes] = useState<string[]>([]);
    const [currentCrop, setCurrentCrop] = useState("");

    function calculateAverageYield() {
        const totalSales = [...[...sales?.filter(s => s.crop === currentCrop) ?? []].map(s => s.amount) ?? [], 0].reduce((a,b) => a+b, 0);
        const totalArea = fields!.filter(f => f.crop === currentCrop).map(f => f.geometry.properties!.area_ha).reduce((a,b) => a+b, 0);
        return totalSales / totalArea;
    }

    useEffect(() => {
        if (fields) {
            const loadedCropTypes = Array.from(new Set(fields.map(f => f.crop))).filter(crop => crop !== "None");

            setUsedCropTypes(loadedCropTypes);

            if (loadedCropTypes.length !== 0) {
                setCurrentCrop(loadedCropTypes[0]);
            }
        }
    }, [])

    return(
        <div className="flex">
            <Nav active="Sales" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <h1 className="text-3xl my-4 font-semibold">Sales</h1>

                    <div className="inline-flex rounded-md shadow-sm mb-6">

                        {
                            usedCropTypes.map(crop => {
                                return(
                                    <button onClick={() => setCurrentCrop(crop)} className={`py-2 px-4 text-sm font-medium bg-white ${usedCropTypes.indexOf(crop) === 0 ? "rounded-l-lg" : ((usedCropTypes.indexOf(crop) === (usedCropTypes.length - 1)) ? "rounded-r-lg" : "")} border border-gray-200 hover:bg-gray-100 hover:text-primary-600 focus:z-10 focus:ring-2 focus:ring-primary-600 focus:text-primary-600 ${crop === currentCrop ? "text-primary-600" : "text-gray-900"}`}>{crop}</button>
                                )
                            })
                        }
                    </div>
                    
                    <p>You have {fields!.filter(f => f.crop === currentCrop).map(f => f.geometry.properties!.area_ha).reduce((a,b) => a+b, 0).toFixed(2)} hectares of land dedicated to growing {currentCrop}.
                    From the data entered, you have a yield of {calculateAverageYield().toFixed(2) ?? 0} tonnes per hectare.</p>

                    <div className="my-4 align-middle shadow-md overflow-hidden border-gray-700 rounded-lg">
                        <table className="table-auto divide-y divide-gray-200 min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                {
                                    ["Date", "Field", "Amount (Tonnes)", "Total Price (£)"].map(heading => {
                                        return(
                                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{heading}</th>
                                        )
                                    })
                                }
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {
                                    sales && sales.filter(sale => sale.crop === currentCrop).map(sale => {
                                        return(
                                            <tr>
                                                {
                                                    [moment(sale.date).format("D/M/YYYY"), fields!.find(f => f._id === sale.field)!.name,sale.amount, sale.price].map(property => {
                                                        return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property}</td>
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }

                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm font-semibold text-primary-600"><Link to="/create-sale">Add</Link></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* <button onClick={() => console.log(sales)}>List all sales</button> */}
                </div>

            </div>
        </div>
    )
}