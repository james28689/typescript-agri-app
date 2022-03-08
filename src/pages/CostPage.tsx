import { useState, useEffect, useRef } from "react";
import Nav from "../components/navbar/Nav";
import { ICost, useDatabase } from "../contexts/DatabaseContext";
import { useHistory, useParams } from "react-router-dom";

type CostPageParams = {
    id: string;
}

export default function CostPage() {
    const { costs, updateCost } = useDatabase();
    const { id } = useParams<CostPageParams>();
    const [cost, setCost] = useState<ICost>({} as ICost);
    const [editMode, setEditMode] = useState(false);
    const history = useHistory();

    const titleRef = useRef<HTMLInputElement>(null);
    const detailRef = useRef<HTMLTextAreaElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let newCost = costs!.filter(cost => {return cost._id === id})[0];
        setCost(newCost);
    }, [costs])

    function update() {
        const newCost = {
            ...cost,
            title: titleRef.current!.value,
            detail: detailRef.current!.value,
            amount: parseFloat(amountRef.current!.value)
        }

        updateCost(newCost);
        setEditMode(false);
    }

    return(
        <div className="flex">
            <Nav active="" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <div className="pb-4 flex flex-row">
                        <button onClick={history.goBack} className="text-primary-600 hover:text-primary-900">Back</button>
                        <div className="w-full"></div>
                        <button className="text-primary-600 hover:text-primary-900" onClick={() => { setEditMode(!editMode) }}>Edit</button>
                    </div>

                    { editMode ? 
                            <div className="space-y-3">
                            <h1 className="text-3xl font-semibold">Editing {cost.title}</h1>
                            <label className="block mb-2 text-sm font-medium text-secondary-900">Title</label>
                            <input type="text" ref={titleRef} defaultValue={cost.title} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                            <label className="block mb-2 text-sm font-medium text-secondary-900">Detail</label>
                            <textarea ref={detailRef} rows={4} defaultValue={cost.detail} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter details..." />

                            <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Amount (£)</label>
                            <input type="number" step="any" ref={amountRef} defaultValue={cost.amount} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                            <button onClick={update} className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Update</button>
                            </div>
                        :
                        <div className="space-y-2">
                        <h1 className="text-3xl font-semibold">{cost.title} - £{cost.amount}</h1>
                        <p>{cost.detail}</p>
                        </div>
                    }

                    
                </div>
            </div>
        </div>
    )
}

/* <select id="crops" className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
    <option>Adjuvants</option>
    <option>Fertiliser</option>
    <option>Fungicides</option>
    <option>Harvest</option>
    <option>Herbicides</option>
    <option>Insecticides</option>
    <option>Lime</option>
    <option>Seed / Plants</option>
</select> */