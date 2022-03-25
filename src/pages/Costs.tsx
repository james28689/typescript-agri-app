import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";
import { Link } from "react-router-dom";
import moment from "moment";

export default function Costs() {
    const { costs, fields } = useDatabase();

    return(
        <div className="flex">
            <Nav active="Costs" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <h1 className="text-3xl my-4 font-semibold">Costs</h1>

                    <div className="my-4 align-middle shadow-md overflow-hidden border-gray-700 rounded-lg">
                        <table className="table-auto divide-y divide-gray-200 min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                {
                                    ["Date", "Title", "Field", "Cost (£)"].map(heading => {
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
                            { /* fields!.find(f => f._id === cost.field)!.name */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {
                                    costs && costs.map(cost => {
                                        return(
                                            <tr>
                                                {
                                                    [moment(cost.date).format("D/M/YYYY"), cost.title, fields!.find(f => f._id === cost.field)!.name, cost.amount].map(property => {
                                                        return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property}</td>
                                                    })
                                                }
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link to={`/cost/${cost._id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm font-semibold text-primary-600"><Link to="/create-cost">Add</Link></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}