import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";

export default function CreateSale() {
    const { fields, createSale } = useDatabase();
    const formRef = useRef<HTMLFormElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const cropRef = useRef<HTMLSelectElement>(null);
    const fieldRef = useRef<HTMLSelectElement>(null);

    const history = useHistory();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        createSale(cropRef.current!.value, parseFloat(amountRef.current!.value), parseFloat(priceRef.current!.value), fields!.find(f=> f.name === fieldRef.current!.value)!._id);
        history.goBack();
    }

    return(
        <div className="flex">
            <Nav active="Sales" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <div className="pb-4 flex flex-row">
                        <button onClick={history.goBack} className="text-primary-600 hover:text-primary-900">Back</button>
                        <div className="w-full"></div>
                    </div>

                    <h1 className="text-3xl font-semibold pb-6">Enter Sale</h1>

                    <label className="block mb-2 text-sm font-medium text-secondary-900">Crop</label>
                    <select ref={cropRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                        {
                            fields && Array.from(new Set(fields.map(f => f.crop))).map(crop => {
                                if (crop !== "None") {
                                    return(
                                        <option>{crop}</option>
                                    )
                                } else {
                                    return <></>
                                }
                            })
                        }
                    </select>

                    <label className="block mb-2 text-sm font-medium text-secondary-900">Field</label>
                    <select ref={fieldRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                        {
                            fields && fields.map(field => {
                                return(
                                    <option>{field.name}</option>
                                )
                            })
                        }
                    </select>
                    
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Amount (tonnes)</label>
                        <input type="number" step="any" required ref={amountRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Sale Price</label>
                        <input type="number" step="any" ref={priceRef} required className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                        <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 w-full rounded-lg font-semibold">Enter</button>
                    </form>
                </div>
            </div>
        </div>
    )
}