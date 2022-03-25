import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";

export default function CreateCost() {
    const { fields, createCost } = useDatabase();
    const formRef = useRef<HTMLFormElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const detailRef = useRef<HTMLTextAreaElement>(null);
    const fieldRef = useRef<HTMLSelectElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);

    const history = useHistory();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createCost(titleRef.current!.value, detailRef.current!.value, fields!.find(f => f.name === fieldRef.current!.value)!._id, parseFloat(amountRef.current!.value));
        history.goBack();
    }

    return(
        <div className="flex">
            <Nav active="Costs" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <div className="pb-4 flex flex-row">
                        <button onClick={history.goBack} className="text-primary-600 hover:text-primary-900">Back</button>
                        <div className="w-full"></div>
                    </div>

                    <h1 className="text-3xl font-semibold pb-6">Enter Cost</h1>

                    <form ref={formRef} onSubmit={handleSubmit}>
                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Title</label>
                        <input type="text" ref={titleRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />
                        
                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Detail</label>
                        <textarea ref={detailRef} rows={4} required className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter details..." />

                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Field</label>
                        <select ref={fieldRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                            {
                                fields && fields.map(f => f.name).map(name => {
                                    return(
                                        <option>{name}</option>
                                    )
                                })
                            }
                        </select>

                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Amount (£)</label>
                        <input type="number" step="any" ref={amountRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                        <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 w-full rounded-lg font-semibold">Enter</button>
                    </form>
                </div>
            </div>
        </div>
    )
}