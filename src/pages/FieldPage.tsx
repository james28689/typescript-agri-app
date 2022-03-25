import { useState, useEffect, useRef } from "react";
import Nav from "../components/navbar/Nav";
import { ICost, IField, IStock, IUsage, ISale, useDatabase } from "../contexts/DatabaseContext";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

type FieldPageParams = {
    id: string;
}

export default function FieldPage() {
    const { fields, updateField, stocks, usages, costs, sales } = useDatabase();
    const { id } = useParams<FieldPageParams>();
    const [editMode, setEditMode] = useState(false);
    const [field, setField] = useState<IField>({} as IField);
    const history = useHistory();
    const cropSelectRef = useRef<HTMLSelectElement>(null);
    
    useEffect(() => {
        let newField = fields!.filter(field => {return field._id === id})[0];
        setField(newField);
    }, [fields, id])

    function update() {
        console.log(cropSelectRef.current!.value);
    
        const newField = {
            ...field,
            crop: cropSelectRef.current!.value
        }

        updateField(newField);
        setEditMode(false);
    }

    function calculateTotalCost(costs: ICost[] | null, stocks: IStock[] | null, usages: IUsage[] | null) {
        const costTotal = costs?.filter(c => c.field === field._id).map(c => c.amount).reduce((a,b) => a+b, 0) ?? 0;
        const stocksUsed = stocks?.filter(s => usages?.filter(u => u.stock === s._id && u.field === field._id).length! > 0);
        if (stocksUsed) {
            const usedStockTotalArr = stocksUsed.map(s => {
            const amountUsed = (usages?.filter(u => u.stock === s._id).map(u => u.amount).reduce((a,b) => a+b, 0) ?? 0);
            const avgPrice = (s.orders.map(s => s.amount * s.pricePerUnit).reduce((a,b) => a+b, 0) / s.orders.map(s => s.amount).reduce((a,b) => a+b, 0));
            return amountUsed * avgPrice;
            });
            return usedStockTotalArr.reduce((a,b) => a+b, 0) + costTotal;
        } else {
            return costTotal;
        }
    }

    function calculateTotalSales(sales: ISale[] | null) {
        return sales?.filter(s => s.field === field._id).map(s => s.price).reduce((a,b) => a+b, 0) ?? 0;
    }

    return(
        <div className="flex">
            <Nav active="" />

        <div className="w-screen h-screen ml-60">
            <div className="p-6">
                <div className="pb-4 flex flex-row">
                    <button onClick={history.goBack} className="text-primary-600 hover:text-primary-900">Back</button>
                    <div className="w-full"></div>
                    <button className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 rounded-lg px-5 py-2.5 text-center mr-2 mb-2" onClick={() => { setEditMode(!editMode) }}>Edit</button>
                </div>

                { editMode ?
                <>
                <div className="flex flex-row items-end">
                    <h1 className="text-3xl font-semibold">{field.name}</h1>
                </div>

                <label className="block mb-2 text-sm font-medium text-secondary-900">Select Crop</label>
                <select ref={cropSelectRef} defaultValue={field.crop} required id="crops" className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    <option>None</option>
                    <optgroup label="Cereals">
                        <option>Wheat</option>
                        <option>Barley</option>
                        <option>Rye</option>
                        <option>Oats</option>
                        <option>Canary Grass</option>
                    </optgroup>
                    <optgroup label="Forage">
                        <option>Maize</option>
                        <option>Clovers</option>
                        <option>Lucerne</option>
                    </optgroup>
                    <optgroup label="Industrial">
                        <option>Flax</option>
                        <option>Sugar Beet</option>
                        <option>Oilseed Rape</option>
                        <option>Soybean</option>
                        <option>Potatoes</option>
                    </optgroup>
                </select>
    
                <button onClick={update} className="mt-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Update</button>
                </>
            :
                <>
                <div className="flex flex-row items-end">
                    <h1 className="text-3xl font-semibold">{field.name}</h1>
                    <h3 className="ml-3 text-xl">{field.crop} - {(field.area_ha ?? 0).toFixed(2)} ha</h3>
                </div>

                <div className="mt-3 flex flex-row">
                    {
                        (calculateTotalCost(costs, stocks, usages) > 0) &&
                        <div id="costs" className="w-1/2">
                            <h2 className="text-xl font-semibold">Costs</h2>
                            <ul>
                                {
                                    costs?.filter(c => c.field === field._id).map(c => {
                                        return(
                                        <li>{c.title} - £{c.amount}</li>
                                        )
                                    })
                                }
                                {
                                    stocks?.map(s => {
                                        if (usages?.filter(u => u.stock === s._id && u.field === field._id).length! > 0) {
                                        return(
                                        <li>{s.name} - £{usages?.filter(u => u.stock === s._id).map(u => u.amount).reduce((a,b) => a+b, 0)! * (s.orders.map(s => s.amount * s.pricePerUnit).reduce((a,b) => a+b, 0) / s.orders.map(s => s.amount).reduce((a,b) => a+b, 0))}</li>
                                        )
                                        } else {
                                        return(
                                        <></>
                                        )
                                        }
                                    })
                                }
                            </ul>
                        </div>
                    }

                    {
                        (field && calculateTotalSales(sales) > 0) &&
                        <div id="sales w-full">
                            <h2 className="text-xl font-semibold">Sales</h2>
                            <ul>
                            {
                                sales?.filter(s => s.field === field._id).map(s => {
                                return(
                                    <li>{moment(s.date).format("D/M/YYYY")} - £{s.price}</li>
                                )
                                })
                            }
                            </ul>
                        </div>
                    }
                </div>

                <p className="mt-4">In total, costs amounted to £{calculateTotalCost(costs, stocks, usages)} and sales amounted to £{calculateTotalSales(sales)}. The total profit/loss was £{calculateTotalSales(sales) - calculateTotalCost(costs, stocks, usages)}.</p>

                {
                    ((calculateTotalSales(sales) - calculateTotalCost(costs, stocks, usages) < field.area_ha * 400 * 4) && calculateTotalSales(sales) > 0) &&
                    <div className="m-8 p-6 min-w-80 min-h-40 inline-block bg-white rounded-xl border shadow-lg">
                        <h3 className="text-xl font-semibold mb-2 text-primary-500">Suggestion</h3>
                        <p>Based on your current sales and costs data, you could possibly make a greater profit on this field by planting a woodland.
                            As part of the new Environmental Land Management Schemes in the UK, the Woodland Carbon Guarantee would allow you to sell
                            verified carbon credits of ~£{(field.area_ha * 400 * 4).toFixed(0)} per year (sold every 5 or 10 years).</p>
                    </div>
                }
                </>
            }
            </div>
        </div>
    </div>
    )
}