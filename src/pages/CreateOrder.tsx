import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";

export default function CreateStock() {
    const { stocks, createOrder } = useDatabase();
    const itemRef = useRef<HTMLSelectElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const pricePerUnitRef = useRef<HTMLInputElement>(null);
    const history = useHistory();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createOrder(parseFloat(amountRef.current!.value), parseFloat(pricePerUnitRef.current!.value), stocks!.find(stock => stock.name === itemRef.current!.value)!._id);
        history.goBack();
    }

    return(
        <div className="flex">
            <Nav active="Stock" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <div className="pb-4 flex flex-row">
                        <button onClick={history.goBack} className="text-primary-600 hover:text-primary-900">Back</button>
                        <div className="w-full"></div>
                    </div>

                    <h1 className="text-3xl font-semibold">Create Order</h1>

                    <form onSubmit={handleSubmit}>
                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Stock Item</label>
                        <select ref={itemRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                            { stocks!.map(stock => {
                                return(
                                    <option>{stock.name}</option>
                                )
                            })}
                        </select>

                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Amount</label>
                        <input type="number" step="any" ref={amountRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Price Per Unit (£)</label>
                        <input type="number" step="any" ref={pricePerUnitRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                        <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 w-full rounded-lg font-semibold">Confirm Order</button>
                    </form>
                </div>
            </div>
        </div>
    )
}