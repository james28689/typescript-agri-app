import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { IStock, IUsage, useDatabase } from "../contexts/DatabaseContext";

export default function Stock() {
    const { stocks, updateStock, deleteStock, usages, fields, createUsage } = useDatabase();
    const [showingModal, setShowingModal] = useState(false);
    const [modalCurrentStockID, setModalCurrentStockID] = useState<string>("");
    const amountUsedRef = useRef<HTMLInputElement>(null);
    const fieldRef = useRef<HTMLSelectElement>(null);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createUsage(parseFloat(amountUsedRef.current!.value), modalCurrentStockID, fields!.find(f => f.name === fieldRef.current!.value)!._id);
        setShowingModal(false);
    }

    return (
        <>
        <div className="flex">
            <Nav active="Stock" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <div className="pb-4 flex flex-row">
                        <h1 className="text-3xl my-4 font-semibold text-secondary-900">Stock</h1>
                        <Link to="/create-order" className="ml-auto text-primary-600 hover:text-primary-900">Create Order</Link>
                    </div>

                    <div className="my-4 align-middle shadow-md overflow-hidden border-gray-700 rounded-lg">
                        <table className="table-auto divide-y divide-gray-200 min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    {
                                        ["Name", "Type", "Units", "In Stock", "Used", "Cost (£)"].map(heading => {
                                            return(
                                                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{heading}</th>
                                            )
                                        })
                                    }

                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Adjust</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                { stocks?.map(stock => {
                                    return(
                                        <tr>
                                            {
                                                [stock.name, stock.type, stock.units, stock.orders.map(o => o.amount).reduce((a,b) => a+b, 0) - usages?.filter(u => u.stock === stock._id).map(u => u.amount).reduce((a,b) => a+b, 0)!, usages?.filter(u => u.stock === stock._id).map(u => u.amount).reduce((a,b) => a+b, 0), stock.orders.map(order => order.amount * order.pricePerUnit).reduce((a,b) => a+b, 0)].map(property => {
                                                    return <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property}</td>
                                                })
                                            }
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => { setShowingModal(!showingModal); setModalCurrentStockID(stock._id)}} className="text-primary-600 hover:text-primary-900">Adjust</button>
                                            </td>
                                        </tr>
                                    )
                                }) }

                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm font-semibold text-primary-600"><Link to="/create-stock">Add</Link></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        {
            showingModal && 
                <div id="modal" aria-hidden="true" className={`flex overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0 backdrop-filter backdrop-blur backdrop-brightness-90`}>
                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                        
                        <div className="relative bg-white rounded-lg shadow">
                            
                            <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-secondary-900 lg:text-2xl dark:text-white">
                                    Adjust { stocks?.find(stock => stock._id === modalCurrentStockID!)!.name }
                                </h3>
                                <button type="button" onClick={() => { setShowingModal(false); setModalCurrentStockID(""); }} className="text-secondary-400 bg-transparent hover:bg-secondary-200 hover:text-secondary-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-6">
                                <label className="block mt-2 mb-2 text-sm font-medium text-secondary-900">Amount Used</label>
                                <input type="number" step="any" min={0} max={stocks?.find(stock => stock._id === modalCurrentStockID!)!.orders.map(order => order.amount).reduce((a,b) => a+b, 0)! - usages?.filter(u => u.stock === modalCurrentStockID!)!.map(u => u.amount).reduce((a,b) => a+b, 0)!} ref={amountUsedRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                                <label className="block mb-2 text-sm font-medium text-secondary-900">Field</label>
                                <select ref={fieldRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                                    {
                                        fields && fields.map(field => {
                                            return(
                                                <option>{field.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            
                            <div className="flex flex-row items-center p-6 rounded-b border-t border-secondary-200 w-full">
                                <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Confirm</button>
                                <button onClick={() => { setShowingModal(false); setModalCurrentStockID(""); }} type="button" className="text-secondary-500 bg-white hover:bg-secondary-100 focus:ring-4 focus:ring-secondary-300 rounded-lg border border-secondary-200 text-sm font-medium px-5 py-2.5 hover:text-secondary-900 focus:z-10 ml-2">Cancel</button>
                                <button onClick={() => deleteStock(modalCurrentStockID)} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto">Remove</button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
        }
        </>
    )
}
