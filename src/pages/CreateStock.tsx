import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import { useDatabase } from "../contexts/DatabaseContext";

export default function CreateStock() {
    const { createStock } = useDatabase();
    const formRef = useRef<HTMLFormElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
    const unitsRef = useRef<HTMLSelectElement>(null);

    const history = useHistory();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        createStock(nameRef.current!.value, typeRef.current!.value, unitsRef.current!.value, 0, 0);
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

                    <h1 className="text-3xl font-semibold">Create Stock</h1>
                    
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Name</label>
                        <input type="text" ref={nameRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                        <label className="block mb-2 text-sm font-medium text-secondary-900">Type</label>
                        <select ref={typeRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                            <option>Adjuvant</option>
                            <option>Fertiliser</option>
                            <option>Fungicide</option>
                            <option>Harvest</option>
                            <option>Herbicide</option>
                            <option>Insecticide</option>
                            <option>Lime</option>
                            <option>Seed / Plant</option>
                        </select>

                        <label className="block mb-2 text-sm font-medium text-secondary-900">Units</label>
                        <select ref={unitsRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3">
                            <option>L</option>
                            <option>ml</option>
                            <option>kg</option>
                            <option>g</option>
                        </select>

                        <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 w-full rounded-lg font-semibold">Create</button>
                    </form>
                </div>
            </div>
        </div>
    )
}